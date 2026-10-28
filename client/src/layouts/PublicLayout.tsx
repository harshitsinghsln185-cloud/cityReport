import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import ChatWidget from '../components/chatbot/ChatWidget';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy focus:text-gold focus:rounded-md focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent font-semibold text-xs"
      >
        Skip to main content
      </a>

      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {/* Global Marketing Footer */}
      <Footer />

      {/* Floating Civic AI Assistant Widget */}
      <ChatWidget />
    </div>
  );
};

export default PublicLayout;

