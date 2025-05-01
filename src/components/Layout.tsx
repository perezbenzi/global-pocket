import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 pb-16 md:pb-0">
        <main className="container mx-auto p-4 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
