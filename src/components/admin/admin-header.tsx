'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/lib/types';
import { HeartHandshake, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type HeaderProps = {
  user: User;
  children?: React.ReactNode;
};

export function AdminHeader({ user, children }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // In a real app, you'd call your Firebase auth signout method here.
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  }

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/inventory', label: 'Inventory' },
    { href: '/chatbot', label: 'Chatbot' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/30 backdrop-blur-lg px-4 md:px-8">
      <Link href="/" className="flex items-center gap-2">
        <HeartHandshake className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-foreground">DisasterAid</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
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
        {children}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground capitalize pt-1">
                  Role: {user.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
