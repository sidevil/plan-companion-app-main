import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { NavigationBar } from './NavigationBar';
import { FloatingActionButton } from './FloatingActionButton';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background font-inter flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">
        <Outlet />
      </main>
      
      <NavigationBar />
      <FloatingActionButton />
    </div>
  );
};