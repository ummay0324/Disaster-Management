import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AccessDashboardButton } from '@/components/access-dashboard-button';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 z-50 bg-background/30 backdrop-blur-lg">
        <Link href="/" className="flex items-center justify-center gap-2">
          <HeartHandshake className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">DisasterAid</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/victim/dashboard"
          >
            Victim
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/admin/dashboard"
          >
            Admin
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/volunteer/dashboard"
          >
            Volunteer
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/chatbot"
          >
            Chatbot
          </Link>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Crisis Response, Simplified
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Complete disaster management solution with real-time inventory tracking, volunteer coordination, and emergency response systems. Built for NGOs and relief organizations.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                   <AccessDashboardButton />
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={600}
                  height={400}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-lg"
                />
              )}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white/5 backdrop-blur-lg border-t border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Our Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  A Faster, More Coordinated Response
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools necessary for effective disaster relief management, from requesting aid to tracking delivery in real-time.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold">Aid Request</h3>
                <p className="text-sm text-muted-foreground">
                  Victims can easily submit requests for essential supplies with automated location tagging.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold">Live Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track the status of your aid request from pending to delivered with real-time updates.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold">Volunteer Coordination</h3>
                <p className="text-sm text-muted-foreground">
                  Assign tasks to volunteers and monitor their progress from a centralized dashboard.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold">Proof of Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure accountability by uploading proof of delivery images for every completed task.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold">Shelter Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Manage shelter capacity, availability, and location details in real-time.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold">Real-time Alerts</h3>
                <p className="text-sm text-muted-foreground">
                   Broadcast critical disaster alerts and updates to all users instantly.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold">Admin Command Center</h3>
                <p className="text-sm text-muted-foreground">
                  A powerful web dashboard for NGOs to monitor all requests, assign volunteers, and manage operations.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold">Inventory Management</h3>
                <p className="text-sm text-muted-foreground">
                  Track aid supplies, manage stock levels, and get low-stock alerts with our inventory dashboard.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold">Real-time Sync</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by Firebase, all data is synchronized in real-time across all devices.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background/30 backdrop-blur-lg">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} DisasterAid. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
