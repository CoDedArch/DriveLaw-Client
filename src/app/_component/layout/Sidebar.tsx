"use client";

import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

// Import your custom icons (you'll create these)
import { useAuth } from '@/app/context/AuthContext';
import DashboardIcon from '../images/dashboard-icon';
import UsersIcon from '../images/user-icon';
import DriversIcon from '../images/drivers-icon';
import VehiclesIcon from '../images/vehicles-icon';
import ProfileIcon from '../images/profile-icon';
import OffensesIcon from '../images/offenses-icon';
import FinesIcon from '../images/fines-icon';
import AppealsIcon from '../images/appeals-icon';
import SettingsIcon from '../images/settings-icon';
import ReportsIcon from '../images/reports-icon';
import InfoIcon from '../images/info-icon';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, authenticated, loading, logout } = useAuth();

  if (!authenticated || loading) return null;

  const renderNavItem = (component: React.ReactNode, href?: string, onClick?: () => void, disabled = false) => {
    const itemClass = disabled 
      ? "opacity-40 cursor-not-allowed flex-shrink-0" 
      : "flex-shrink-0 hover:scale-105 transition-transform duration-200";
    
    if (href && !disabled) {
      return (
        <Link href={href} className={itemClass} onClick={onClick}>
          {component}
        </Link>
      );
    }
    
    if (onClick && !disabled) {
      return (
        <button onClick={onClick} className={itemClass}>
          {component}
        </button>
      );
    }
    
    return <div className={itemClass}>{component}</div>;
  };

  const getNavigationItems = () => {
    const isActive = user?.is_active;
    const items = [
      { 
        component: <DashboardIcon />, 
        href: "/dashboard", 
        onClick: () => onTabChange('dashboard'),
        disabled: false 
      },
    ];

    // Role-based items
    if (user?.role === "admin") {
      items.push(
        // { component: <UsersIcon />, href: "/users", onClick: () => onTabChange('users'), disabled: !isActive },
        { component: <DriversIcon />, href: "/drivers", onClick: () => onTabChange('drivers'), disabled: !isActive },
        // { component: <VehiclesIcon />, href: "/vehicles", onClick: () => onTabChange('vehicles'), disabled: !isActive },
        { component: <OffensesIcon />, href: "/offenses", onClick: () => onTabChange('offenses'), disabled: !isActive },
        { component: <FinesIcon />, href: "/fines", onClick: () => onTabChange('fines'), disabled: !isActive },
        { component: <AppealsIcon />, href: "/appeals", onClick: () => onTabChange('appeals'), disabled: !isActive },
        { component: <ReportsIcon />, href: "/reports", onClick: () => onTabChange('reports'), disabled: !isActive }
      );
    }

    if (user?.role === "officer") {
      items.push(
        { component: <DriversIcon />, href: "/drivers", onClick: () => onTabChange('drivers'), disabled: !isActive },
        // { component: <VehiclesIcon />, href: "/vehicles", onClick: () => onTabChange('vehicles'), disabled: !isActive },
        { component: <OffensesIcon />, href: "/offenses", onClick: () => onTabChange('offenses'), disabled: !isActive },
        { component: <FinesIcon />, href: "/fines", onClick: () => onTabChange('fines'), disabled: !isActive },
        { component: <ReportsIcon />, href: "/reports", onClick: () => onTabChange('reports'), disabled: !isActive }
      );
    }

    if (user?.role === "driver") {
      items.push(
        { component: <OffensesIcon />, href: "/offenses", onClick: () => onTabChange('my-offenses'), disabled: !isActive },
        { component: <FinesIcon />, href: "/fines", onClick: () => onTabChange('my-fines'), disabled: !isActive },
        { component: <AppealsIcon />, href: "/appeals", onClick: () => onTabChange('appeals'), disabled: !isActive },
        { component: <ProfileIcon />, href: "/profile", onClick: () => onTabChange('profile'), disabled: !isActive }
      );
    }

    // Add settings for admin only
    if (user?.role === "admin") {
      items.push({ component: <SettingsIcon />, href: "/settings", onClick: () => onTabChange('settings'), disabled: !isActive });
    }
    
    return items;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white text-gray-800 border-r border-gray-100 flex-col justify-between py-6 pl-4 shadow-sm backdrop-blur-sm bg-opacity-95">
        <nav className="flex flex-col gap-4 flex-1 w-full pl-10">
          <Link href={"/"}>
            <DashboardIcon />
          </Link>

          {authenticated && (
            <>
              {user?.is_active ? (
                <>
                  {user?.role === "admin" && (
                    <>
                      {/* <Link href={"/users"} onClick={() => onTabChange('users')}>
                        <UsersIcon />
                      </Link> */}
                      <Link href={"/admin/drivers"} onClick={() => onTabChange('drivers')}>
                        <DriversIcon />
                      </Link>
                      <Link href={"/offenses/admin/offenses"} onClick={() => onTabChange('offenses')}>
                        <OffensesIcon />
                      </Link>
                      <Link href={"/fines"} onClick={() => onTabChange('fines')}>
                        <FinesIcon />
                      </Link>
                      <Link href={"/appeals/admin"} onClick={() => onTabChange('appeals')}>
                        <AppealsIcon />
                      </Link>
                    </>
                  )}

                  {user?.role === "officer" && (
                    <>
                      <Link href={"/admin/drivers"} onClick={() => onTabChange('drivers')}>
                        <DriversIcon />
                      </Link>
                      {/* <Link href={"/vehicles"} onClick={() => onTabChange('vehicles')}>
                        <VehiclesIcon />
                      </Link> */}
                      <Link href={"/offenses"} onClick={() => onTabChange('offenses')}>
                        <OffensesIcon />
                      </Link>
                      <Link href={"/offenses/officer/offenses"} onClick={() => onTabChange('offenses-management')}>
                        <OffensesIcon title='Offenses Management' />
                      </Link>
                      <Link href={"/fines"} onClick={() => onTabChange('fines')}>
                        <FinesIcon />
                      </Link>
                      {/* <Link href={"/reports"} onClick={() => onTabChange('reports')}>
                        <ReportsIcon />
                      </Link> */}
                    </>
                  )}

                  {user?.role === "driver" && (
                    <>
                      <Link href={"/offenses"} onClick={() => onTabChange('my-offenses')}>
                        <OffensesIcon />
                      </Link>
                      <Link href={"/fines"} onClick={() => onTabChange('my-fines')}>
                        <FinesIcon />
                      </Link>
                      <Link href={"/appeals"} onClick={() => onTabChange('appeals')}>
                        <AppealsIcon />
                      </Link>
                      {/* <Link href={"/profile"} onClick={() => onTabChange('profile')}>
                        <ProfileIcon />
                      </Link> */}
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Disabled state for inactive users */}
                  {user?.role === "admin" && (
                    <>
                      <div className="opacity-40 cursor-not-allowed">
                        <UsersIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <DriversIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <VehiclesIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <OffensesIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <FinesIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <AppealsIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <ReportsIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <SettingsIcon />
                      </div>
                    </>
                  )}

                  {user?.role === "officer" && (
                    <>
                      <div className="opacity-40 cursor-not-allowed">
                        <DriversIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <VehiclesIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <OffensesIcon title='Offenses Management' />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <OffensesIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <FinesIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <ReportsIcon />
                      </div>
                    </>
                  )}

                  {user?.role === "driver" && (
                    <>
                      <div className="opacity-40 cursor-not-allowed">
                        <OffensesIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <FinesIcon />
                      </div>
                      <div className="opacity-40 cursor-not-allowed">
                        <AppealsIcon />
                      </div>
                      {/* <div className="opacity-40 cursor-not-allowed">
                        <ProfileIcon />
                      </div> */}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </nav>

        <div className="flex flex-col gap-8 mb-8">
          <InfoIcon />
          {/* {authenticated && (
            <div className="mt-auto pt-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="flex items-center justify-center w-full p-3 rounded-lg transition-all duration-200
                bg-red-600 hover:bg-red-700 
                text-white font-medium text-sm
                shadow-sm hover:shadow-md
                transform hover:scale-[1.01] active:scale-[0.99]
                group"
              >
                <LogOut className="h-4 w-4 mr-3 transition-all duration-200 group-hover:scale-105" />
                <span className="flex-1 text-left">Sign Out</span>
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </button>
            </div>
          )} */}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        {/* Main navigation items */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 px-4 py-3 min-w-max">
            {getNavigationItems().map((item, index) => (
              <div key={index} className="px-1">
                {renderNavItem(item.component, item.href, item.onClick, item.disabled)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom row with Info and Logout */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex-shrink-0">
            <InfoIcon />
          </div>
          
          {authenticated && (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
              bg-red-600 hover:bg-red-700 active:bg-red-800
              text-white font-medium text-xs
              shadow-sm active:scale-95"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;