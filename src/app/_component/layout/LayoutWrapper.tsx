"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import Sidebar from "./Sidebar";
import AppHeader from "./Header";
import { useAuth } from "@/app/context/AuthContext";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { authenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const hideSidebarRoutes = ["/onboarding", "/login"];
  
  // Conditionally add "/" to hideHeaderRoutes if user is not authenticated
  const baseHideHeaderRoutes = ["/onboarding", "/login"];
  const hideHeaderRoutes = !authenticated ? [...baseHideHeaderRoutes, "/"] : baseHideHeaderRoutes;
  
  const shouldShowSidebar = !hideSidebarRoutes.includes(pathname);
  const shouldShowHeader = !hideHeaderRoutes.includes(pathname);


  // Update activeTab based on current pathname
  useEffect(() => {
    // Extract the main route from pathname
    const route = pathname.split('/')[1] || 'dashboard';
    
    // Map routes to tab names
    const routeToTab: Record<string, string> = {
      'dashboard': 'dashboard',
      'users': 'users',
      'drivers': 'drivers',
      'vehicles': 'vehicles',
      'offenses': 'offenses',
      'fines': 'fines',
      'appeals': 'appeals',
      'reports': 'reports',
      'settings': 'settings',
      'profile': 'profile',
      'my-offenses': 'my-offenses',
      'my-fines': 'my-fines',
    };

    const tabName = routeToTab[route] || 'dashboard';
    setActiveTab(tabName);
  }, [pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowHeader && <AppHeader />}
      
      {/* Main content area */}
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        {shouldShowSidebar && (
          <Sidebar 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 bg-gray-900 w-full">
          {/* Add bottom padding on mobile to account for bottom navigation */}
          <section className={`h-full ${shouldShowSidebar ? 'pb-24 md:pb-0' : ''}`}>
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}