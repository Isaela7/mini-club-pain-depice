import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { NavigationBar } from './NavigationBar';

export function ParentLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <main className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mt-16 sm:mt-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}