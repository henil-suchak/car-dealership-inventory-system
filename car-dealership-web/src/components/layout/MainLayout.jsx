import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col relative w-full">
      <Navbar />
      <main className="flex-grow flex flex-col w-full h-full relative">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
