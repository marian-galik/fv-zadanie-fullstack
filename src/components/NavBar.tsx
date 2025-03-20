"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Navigation bar component that displays links to different tree view implementations.
 * Highlights the current active route based on the pathname.
 *
 * @returns A responsive navigation bar with styled links
 */
export function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Standard Tree" },
    { href: "/lazy", label: "Lazy Loading Tree" },
  ];

  return (
    <nav className="border-b mb-6">
      <div className="container mx-auto py-3 flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-1.5 rounded-md transition-colors text-sm font-medium",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
