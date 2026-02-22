'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { portalManager } from '../lib/portalManager';

import { useRouter } from 'next/navigation';
import PortalLogin from './PortalLogin';
import PortalRegistration from './PortalRegistration';
import CustomerDashboard from './CustomerDashboard';
import type { PortalData } from '../lib/portalManager';

const CustomerPortalLanding = ({ portalUrl }: { portalUrl: string }): JSX.Element => {
  const router = useRouter();
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState('landing');
  const [params, setParams] = useState({});

  useEffect(() => {
    // Load portal data based on URL
    const portalInfo = portalManager.getPortalByUrl(portalUrl);
    
    if (portalInfo) {
      // Get user data from tree manager
      const userData = treeManager.getUserById(portalInfo.userId);
      
      if (userData) {
        setPortalData({
          ...portalInfo.portal,
          ownerName: userData.name,
          ownerId: portalInfo.userId,
          user: {
            userId: portalInfo.userId,
            name: userData.name,
            email: userData.email,
            userType: userData.userType || 'customer'
          }
        });
      } else {
        setError("Portal owner not found");
      }
    } else {
      setError("Portal not found");
    }
    
    setLoading(false);
  }, [portalUrl]);

  const switchView = (newView, newParams = {}) => {
    setView(newView);
    setParams(newParams);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Portal Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate view based on the current view state
  switch (view) {
    case 'landing':
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  {portalData.logo && (
                    <img src={portalData.logo} alt="Portal Logo" className="h-12 mr-3" />
                  )}
                  <h1 className="text-3xl font-bold text-gray-800">
                    {portalData.brandName || "ENGINEERS"}
                  </h1>
                </div>
                <p className="text-gray-600 mb-6">{portalData.brandMessage || "Welcome to our customer portal"}</p>
                
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => switchView('register')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition transform hover:scale-105"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => switchView('login')}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition transform hover:scale-105"
                  >
                    Login
                  </button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p>Powered by ENGINEERS</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 'login':
      return (
        <PortalLogin 
          onSwitchView={switchView} 
          parentInfo={{
            parentId: portalData.ownerId,
            parentName: portalData.ownerName
          }}
          successMessage={params.successMessage}
          isPortal={true}
          portalBrandName={portalData.brandName || "ENGINEERS"}
          portalLogo={portalData.logo}
        />
      );
    case 'register':
      return (
        <PortalRegistration 
          onSwitchView={switchView} 
          parentInfo={{
            parentId: portalData.ownerId,
            parentName: portalData.ownerName
          }}
          isPortal={true}
          portalBrandName={portalData.brandName || "ENGINEERS"}
          portalLogo={portalData.logo}
        />
      );
    case 'customerDashboard':
      return (
        <CustomerDashboard 
          user={params}
          onLogout={() => router.push(`/portal/${portalUrl}`)}
        />
      );
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                <button
                  onClick={() => switchView('landing')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Back to Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      );
  }
}



export default CustomerPortalLanding;
