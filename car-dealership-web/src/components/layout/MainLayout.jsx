import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16 relative">
      <Navbar />
      <main className="flex-grow flex flex-col w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
