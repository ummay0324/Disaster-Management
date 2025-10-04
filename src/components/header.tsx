'use client';

import { HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  
  const navLinks = [
    { href: '/', label: 'Home'},
    { href: '/victim/dashboard', label: 'Request Aid' },
    { href: '/volunteer/dashboard', label: 'Volunteer Tasks' },
    { href: '/admin/dashboard', label: 'Admin Dashboard' },
    { href: '/inventory', label: 'Inventory' },
    { href: '/chatbot', label: 'Chatbot' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/30 backdrop-blur-lg px-4 md:px-8">
      <Link href="/" className="flex items-center gap-2">
        <HeartHandshake className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-foreground">DisasterAid</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4">
         {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium hover:underline underline-offset-4",
              pathname === link.href ? "text-primary" : "text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
