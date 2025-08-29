
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";
import {
  BookOpenCheck,
  Home,
  ListChecks,
  MessageSquareWarning,
  FileQuestion,
  Lightbulb,
  Smile,
  Clapperboard,
  Layers,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { NavLink } from '@/lib/types';
import { cn } from "@/lib/utils";

export const navLinks: NavLink[] = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/mood-helper", label: "Mood Helper", icon: Smile },
    { href: "/suggested-changes", label: "Suggested Changes", icon: Lightbulb },
    { href: "/content", label: "Content", icon: ListChecks },
    { href: "/lectures", label: "Lectures", icon: Clapperboard },
    { href: "/flashcards", label: "Flashcards", icon: Layers },
    { href: "/doubts", label: "Doubts", icon: FileQuestion },
    { href: "/help", label: "Help Requests", icon: MessageSquareWarning },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <TooltipProvider>
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                        href="/"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <BookOpenCheck className="h-4 w-4 transition-all group-hover:scale-110" />
                        <span className="sr-only">Study Buddy</span>
                    </Link>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                        return (
                             <Tooltip key={link.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                    href={link.href}
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                                        isActive && "bg-accent text-accent-foreground"
                                    )}
                                    >
                                    <link.icon className="h-5 w-5" />
                                    <span className="sr-only">{link.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">{link.label}</TooltipContent>
                            </Tooltip>
                        )
                    })}
                </nav>
            </TooltipProvider>
        </aside>
    )
}
