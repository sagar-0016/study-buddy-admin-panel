
"use client";

import * as React from "react";
import Link from "next/link";
import {
  PanelLeft,
  GraduationCap,
  User,
  LogOut,
  ShieldCheck,
  ArrowLeftRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from 'next/navigation';
import { userNavLinks, adminNavLinks } from '@/lib/types';
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/context/auth-context";
import { useApp } from "@/context/app-context";
import { useSidebar } from "@/context/sidebar-context";

export default function Header() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { view, toggleView } = useApp();
  
  const navLinks = view === 'admin' ? adminNavLinks : userNavLinks;

  const pathSegments = pathname.split('/').filter(p => p);
  
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    const isLast = index === pathSegments.length - 1;
    return { href, label, isLast };
  });

  const handleToggleView = () => {
    const newView = view === 'user' ? 'admin' : 'user';
    toggleView(newView);
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <GraduationCap className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Sagar's Study Buddy</span>
            </Link>
            {navLinks.map((link) => (
               <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-2.5 ${pathname.startsWith(link.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                <Link href={view === 'admin' ? '/admin' : '/'}>{view === 'admin' ? 'Admin' : 'Syllabus'}</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            {pathname !== '/' && pathname !== '/admin' && breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                    <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                </React.Fragment>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex items-center gap-2 md:grow-0">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <User className="h-5 w-5"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleToggleView}>
              {view === 'user' ? (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />Admin Panel
                </>
              ) : (
                <>
                  <ArrowLeftRight className="mr-2 h-4 w-4" />Switch to App
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
