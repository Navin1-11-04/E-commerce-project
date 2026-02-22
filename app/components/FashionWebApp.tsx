'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartProvider } from '../context/CartContext';
import Header from './Header';
import Footer from './Footer';
import LandingPage from './LandingPage';
import CategoryPage from './CategoryPage';
import ShoppingCartPage from './ShoppingCartPage';
import WishlistPage from './WishlistPage';
import CheckoutPage from './CheckoutPage';
import OrderSummaryPage from './OrderSummaryPage';
import OrderHistoryPage from './OrderHistoryPage';
import OrderTrackingPage from './OrderTrackingPage';
import AboutUsPage from './AboutUsPage';
import NewsPage from './NewsPage';
import EntrepreneursPage from './EntrepreneursPage';
import BrandOwnersPage from './BrandOwnersPage';
import FoundersPage from './FoundersPage';
import DocumentsPage from './DocumentsPage';
import BankingsPage from './BankingsPage';
import LegalsPage from './LegalsPage';
import ServicesPage from './ServicesPage';
import ContactUsPage from './ContactUsPage';
import TreeVisualization from './TreeVisualization';
import CustomerDashboard from './CustomerDashboard';
import BrandOwnerDashboard from './BrandOwnerDashboard';
import type { PageName, UserType, UserData } from '../types';

// AuthApp stub — replace with your real auth implementation
const AuthApp = ({
  onSwitchView,
  onLoginSuccess,
}: {
  onSwitchView: (view: string) => void;
  onLoginSuccess: (userData: UserData) => void;
}): JSX.Element => <div>Auth App (not implemented)</div>;

const CATEGORY_PAGES: PageName[] = ['mens', 'womens', 'accessories', 'all'];

const FashionWebApp = (): JSX.Element => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<PageName>('landing');
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const handleLoginSuccess = (userData: UserData): void => {
    setCurrentUser(userData);
    setUserType(userData.userType);
    setIsLoggedIn(true);
    setShowAuth(false);
    if (userData.userType === 'customer') setCurrentPage('customerDashboard');
    else if (userData.userType === 'brand_owner') setCurrentPage('brandOwnerDashboard');
    else setCurrentPage('landing');
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    setUserType(null);
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  const handleNavigateToSignup = (): void => router.push('/signup');

  const renderPage = (): JSX.Element => {
    if (showAuth) {
      return (
        <AuthApp
          onSwitchView={(view) => {
            if (view === 'home') { setShowAuth(false); setCurrentPage('landing'); }
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    if (currentPage === 'customerDashboard' && userType === 'customer' && currentUser) {
      return (
        <CustomerDashboard
          user={currentUser}
          onLogout={handleLogout}
          setCurrentPage={setCurrentPage}
          onNavigateToSignup={handleNavigateToSignup}
        />
      );
    }

    if (currentPage === 'brandOwnerDashboard' && userType === 'brand_owner') {
      return (
        <BrandOwnerDashboard
          setCurrentPage={setCurrentPage}
          user={currentUser}
          onNavigateToSignup={handleNavigateToSignup}
        />
      );
    }

    if (currentPage === 'tree') {
      return <TreeVisualization onRunConsolidation={() => {}} />;
    }

    if (currentPage === 'cart') return <ShoppingCartPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'checkout') return <CheckoutPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'orderSummary') return <OrderSummaryPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'orderHistory') return <OrderHistoryPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'orderTracking') return <OrderTrackingPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'wishlist') return <WishlistPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;

    if (CATEGORY_PAGES.includes(currentPage)) {
      return (
        <CategoryPage
          category={currentPage}
          setCurrentPage={setCurrentPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNavigateToSignup={handleNavigateToSignup}
        />
      );
    }

    if (currentPage === 'services') return <ServicesPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'contact') return <ContactUsPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'aboutus') return <AboutUsPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'news') return <NewsPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'entrepreneurs') return <EntrepreneursPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'brandowners') return <BrandOwnersPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'founders') return <FoundersPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'documents') return <DocumentsPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'bankings') return <BankingsPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;
    if (currentPage === 'legals') return <LegalsPage setCurrentPage={setCurrentPage} onNavigateToSignup={handleNavigateToSignup} />;

    // Default — landing
    return (
      <LandingPage
        setCurrentPage={setCurrentPage}
        setUserType={setUserType}
        setIsLoggedIn={setIsLoggedIn}
        setShowAuth={setShowAuth}
        onNavigateToSignup={handleNavigateToSignup}
      />
    );
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">{renderPage()}</div>
    </CartProvider>
  );
};

export default FashionWebApp;
