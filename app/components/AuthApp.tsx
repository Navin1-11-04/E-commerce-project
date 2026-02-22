'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TreeVisualization from './TreeVisualization';
import CustomerDashboard from './CustomerDashboard';
import BrandOwnerDashboard from './BrandOwnerDashboard';
import ManageCustomerPortal from './ManageCustomerPortal';
import PortalView from './PortalView';
import PortalLogin from './PortalLogin';
import PortalRegistration from './PortalRegistration';
import { treeManager } from '../lib/mlmTree';
import type { UserData } from '../types';

import Login from './Login';
import CustomerRegistration from './CustomerRegistration';
import BrandOwnerRegistration from './BrandOwnerRegistration';
import ForgotPassword from './ForgotPassword';
import TwoFactorAuthSetup from './TwoFactorAuthSetup';

const AuthApp = (): JSX.Element => {
  const pathname = usePathname();

  const [currentView, setCurrentView] = useState("login");
  const [treeUpdateTrigger, setTreeUpdateTrigger] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [portalId, setPortalId] = useState<string | null>(null);
  const [twoFactorAuthUser, setTwoFactorAuthUser] = useState<UserData | null>(null);

  // Check if we're accessing a portal URL
  useEffect(() => {
    const path = pathname;
    if (path.startsWith('/portal/')) {
      const id = path.split('/')[2];
      setPortalId(id);
      setCurrentView('portalView');
    }
  }, [pathname]);

  const handleTreeUpdate = () => {
    setTreeUpdateTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTwoFactorAuthUser(null);
    setCurrentView("login");
  };

  // Global function to switch to customer portal
  useEffect(() => {
    (window as any).switchToCustomerPortal = (user: UserData) => {
      setCurrentUser(user);
      setCurrentView('customerDashboard');
    };
    
    (window as any).switchToManagePortal = (user: UserData) => {
      setCurrentUser(user);
      setCurrentView('managePortal');
    };
  }, []);

  const handle2FASuccess = () => {
    if (!twoFactorAuthUser) { setCurrentView('login'); return; }
    if (twoFactorAuthUser.userType === 'customer') {
      setCurrentUser({
        userId: twoFactorAuthUser.userId,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType
      });
      setCurrentView('customerDashboard');
    } else if (twoFactorAuthUser.userType === 'brand_owner') {
      setCurrentUser({
        userId: twoFactorAuthUser.userId,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType,
      });
      setCurrentView('brandOwnerDashboard');
    } else if (twoFactorAuthUser.userType === 'founder') {
      setCurrentUser({
        userId: twoFactorAuthUser.userId,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType
      });
      setCurrentView('customerDashboard');
    }
    setTwoFactorAuthUser(null);
  };

  const handle2FASkip = () => {
    if (!twoFactorAuthUser) { setCurrentView('login'); return; }
    if (twoFactorAuthUser.userType === 'customer') {
      setCurrentUser({
        userId: twoFactorAuthUser.userId,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType
      });
      setCurrentView('customerDashboard');
    } else if (twoFactorAuthUser.userType === 'brand_owner') {
      setCurrentUser({
        userId: twoFactorAuthUser.userId,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType,
      });
      setCurrentView('brandOwnerDashboard');
    } else if (twoFactorAuthUser.userType === 'founder') {
      setCurrentUser({
        userId: twoFactorAuthUser.userId,
        name: twoFactorAuthUser.name,
        email: twoFactorAuthUser.email,
        userType: twoFactorAuthUser.userType
      });
      setCurrentView('customerDashboard');
    }
    setTwoFactorAuthUser(null);
  };

  const handleBackToLogin = () => {
    setTwoFactorAuthUser(null);
    setCurrentView("login");
  };

  const renderCurrentView = (): JSX.Element | null => {
    switch (currentView) {
      case "customer":
        return <CustomerRegistration onSwitchView={setCurrentView} onTreeUpdate={handleTreeUpdate} />;
      case "brandOwner":
        return <BrandOwnerRegistration onSwitchView={setCurrentView} onTreeUpdate={handleTreeUpdate} />;
      case "forgot":
        return <ForgotPassword onBackToLogin={() => setCurrentView("login")} />;
      case "tree":
        return <TreeVisualization key={treeUpdateTrigger} onRunConsolidation={handleTreeUpdate} />;
      case "customerDashboard":
        return <CustomerDashboard user={currentUser!} onLogout={handleLogout} />;
      case "brandOwnerDashboard":
        return <BrandOwnerDashboard user={currentUser!} onLogout={handleLogout} />;
      case "managePortal":
        return (
          <ManageCustomerPortal 
            user={currentUser!} 
            onLogout={handleLogout}
            onSwitchToDashboard={() => {
              setCurrentView('customerDashboard');
            }}
          />
        );
      case "portalView":
        return <PortalView portalId={portalId} onSwitchView={setCurrentView} />;
      case "twoFactorAuth":
        if (!twoFactorAuthUser) { setCurrentView('login'); return null; }
        return (
          <TwoFactorAuthSetup
            user={twoFactorAuthUser}
            onVerificationSuccess={handle2FASuccess}
            onSkip={handle2FASkip}
            onBackToLogin={handleBackToLogin}
          />
        );
      default:
        return <Login onSwitchView={(view: string, data?: unknown) => {
          const d = data as Record<string, unknown> | undefined;
          if (view === 'twoFactorAuth' && d?.user) {
            setTwoFactorAuthUser(d.user as UserData);
            setCurrentView(view);
          } else if (d) {
            setCurrentUser(d as UserData);
            setCurrentView(view);
          } else {
            setCurrentView(view);
          }
        }} />;
    }
  };

  return (
    <div>
      {renderCurrentView()}
      
      {/* Only show navigation bar if not in portal view or 2FA view */}
      {currentView !== 'portalView' && currentView !== 'twoFactorAuth' && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl p-2 flex space-x-2 border-2 border-gray-200 z-50">
          <button
            onClick={() => {
              setCurrentUser(null);
              setTwoFactorAuthUser(null);
              setCurrentView("login");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === "login"
                ? "bg-gray-700 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🔐 Login
          </button>
          <button
            onClick={() => {
              setCurrentUser(null);
              setTwoFactorAuthUser(null);
              setCurrentView("customer");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === "customer"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            👤 Customer
          </button>
          <button
            onClick={() => {
              setCurrentUser(null);
              setTwoFactorAuthUser(null);
              setCurrentView("brandOwner");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === "brandOwner"
                ? "bg-purple-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🏢 Brand
          </button>
          <button
            onClick={() => {
              setCurrentUser(null);
              setTwoFactorAuthUser(null);
              setCurrentView("tree");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === "tree"
                ? "bg-green-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            🌳 Tree
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthApp;