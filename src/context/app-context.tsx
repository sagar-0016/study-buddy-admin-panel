
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type ViewType = 'user' | 'admin';

type AppContextType = {
  view: ViewType;
  toggleView: (newView: ViewType) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<ViewType>('user');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const savedView = localStorage.getItem('study-buddy-view') as ViewType | null;
      if (savedView && (savedView === 'user' || savedView === 'admin')) {
        setView(savedView);
      }
    } catch (e) {
        console.error("Local storage not available.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  const toggleView = useCallback((newView: ViewType) => {
    setView(newView);
    try {
      localStorage.setItem('study-buddy-view', newView);
    } catch (e) {
      console.error("Local storage not available.");
    }
    // After switching, always navigate to the root of that view
    // to avoid being on a non-existent page.
    if (newView === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AppContext.Provider value={{ view, toggleView }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
