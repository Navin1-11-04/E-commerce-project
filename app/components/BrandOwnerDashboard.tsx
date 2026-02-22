'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import type { PageName, UserData } from '../types';

interface BrandOwnerDashboardProps {
  setCurrentPage: (page: PageName) => void;
  onNavigateToSignup?: () => void;
  user?: UserData | null;
}

// TODO: Implement BrandOwnerDashboard — the source file ends before this component.
const BrandOwnerDashboard = ({ setCurrentPage, onNavigateToSignup, user }: BrandOwnerDashboardProps): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Brand Owner Dashboard</h2>
        <p className="text-gray-500">Coming soon — implementation pending.</p>
      </div>
    </div>
  );
};

export default BrandOwnerDashboard;
