
"use client";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from '@/context/auth-context';
import { AppProvider, useApp } from "@/context/app-context";
import { SidebarProvider, useSidebar } from "@/context/sidebar-context";
import LoginFlow from '@/components/auth/login-flow';
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";


function AppShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        isCollapsed ? "md:pl-14" : "md:pl-[220px] lg:pl-[280px]"
      )}>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}


function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginFlow />;
  }

  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Sagar's Study Buddy</title>
        <meta name="description" content="Your personalized companion for JEE preparation." />
        <link rel="icon" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            <AppProvider>
                <AppContent>{children}</AppContent>
                <Toaster />
            </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
