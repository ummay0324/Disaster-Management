'use client';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminHeader({ user }: { user: User }) {
    const pathname = usePathname();
    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/inventory', label: 'Inventory' },
    ];
  return (
    <Header user={user}>
      <nav className="hidden md:flex items-center gap-2">
        {navItems.map(item => (
            <Button asChild variant={pathname === item.href ? "secondary" : "ghost"} key={item.href}>
                <Link href={item.href}>{item.label}</Link>
            </Button>
        ))}
      </nav>
    </Header>
  );
}
