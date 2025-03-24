'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Settings, 
  UserCircle, 
  X 
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { signOut, checkUnauth } from '@/lib/supabase/auth-helpers';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check if user is not authenticated, redirect to login
  useEffect(() => {
    const check = async () => {
      setIsLoading(true);
      const isUnauthenticated = await checkUnauth(router);
      if (!isUnauthenticated) {
        setIsLoading(false);
      }
    };
    
    check();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(router);
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Availability', href: '/dashboard/availability', icon: <Clock className="h-5 w-5" /> },
    { name: 'Appointments', href: '/dashboard/appointments', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Profile', href: '/dashboard/profile', icon: <UserCircle className="h-5 w-5" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ease-in-out lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setSidebarOpen(false)}
      />
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h1 className="text-xl font-bold text-primary">SupaSched</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                pathname === item.href 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
          <button 
            onClick={handleSignOut}
            className="flex w-full items-center px-3 py-2 rounded-md transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sign Out</span>
          </button>
        </nav>
      </div>

      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 bg-white dark:bg-gray-800 border-b shadow-sm flex items-center px-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(true)} 
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="mx-4 lg:hidden font-semibold">SupaSched</div>
          <div className="flex-1" />
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/help">Help</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </nav>
        </header>

        {/* Main content */}
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 