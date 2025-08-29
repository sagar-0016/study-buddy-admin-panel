
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { userNavLinks, adminNavLinks } from '@/lib/types';
import { useSidebar } from "@/context/sidebar-context";
import { useApp } from "@/context/app-context";


function SidebarNav({ links, isCollapsed }: { links: (typeof userNavLinks), isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
     <nav className={cn("grid gap-1 px-2", isCollapsed ? "justify-center" : "")}>
      {links.map((link) => {
        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        const navLink = (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-primary/10 text-primary",
              isCollapsed && "h-9 w-9 items-center justify-center rounded-lg p-0"
            )}
          >
            <link.icon className="h-4 w-4" />
            <span className={cn("sr-only", !isCollapsed && "not-sr-only")}>{link.label}</span>
          </Link>
        );

        if (isCollapsed) {
          return (
            <Tooltip key={link.href} delayDuration={0}>
              <TooltipTrigger asChild>{navLink}</TooltipTrigger>
              <TooltipContent side="right">
                <p>{link.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        }
        return navLink;
      })}
    </nav>
  );
}


export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { view } = useApp();

  const navLinks = view === 'admin' ? adminNavLinks : userNavLinks;

  return (
    <aside className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-background transition-all duration-300 md:flex",
        isCollapsed ? "w-14" : "w-[220px] lg:w-[280px]"
    )}>
      <TooltipProvider>
        <div className={cn(
            "flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6",
            isCollapsed && "justify-center"
        )}>
            <button onClick={toggleSidebar} className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className={cn(isCollapsed && "sr-only")}>
                {view === 'admin' ? 'Admin Panel' : "Sagar's Study Buddy"}
              </span>
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-y-2 overflow-y-auto py-4">
             <div className="flex-1">
                <SidebarNav links={navLinks} isCollapsed={isCollapsed} />
             </div>
          </div>
      </TooltipProvider>
    </aside>
  );
}
