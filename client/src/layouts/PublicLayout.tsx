import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import ChatWidget from '../components/chatbot/ChatWidget';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
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

