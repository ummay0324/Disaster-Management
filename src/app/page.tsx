import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeartHandshake, PackageCheck, Route, Users, ShieldCheck, Tv, Siren, LayoutDashboard, GanttChartSquare, Smartphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  const features = [
      {
        icon: <PackageCheck className="h-8 w-8 text-primary" />,
        title: "Aid Request",
        description: "Victims can easily submit requests for essential supplies with automated location tagging.",
        href: "/victim/dashboard"
      },
      {
        icon: <Route className="h-8 w-8 text-primary" />,
        title: "Live Tracking",
        description: "Track the status of your aid request from pending to delivered with real-time updates.",
        href: "/victim/dashboard"
      },
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Volunteer Coordination",
        description: "Assign tasks to volunteers and monitor their progress from a centralized dashboard.",
        href: "/admin/dashboard"
      },
      {
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
        title: "Proof of Delivery",
        description: "Ensure accountability by uploading proof of delivery images for every completed task.",
        href: "/volunteer/dashboard"
      },
      {
        icon: <Tv className="h-8 w-8 text-primary" />,
        title: "Shelter Tracking",
        description: "Manage shelter capacity, availability, and location details in real-time.",
        href: "/admin/dashboard"
      },
      {
        icon: <Siren className="h-8 w-8 text-primary" />,
        title: "Real-time Alerts",
        description: "Broadcast critical disaster alerts and updates to all users instantly.",
        href: "/admin/dashboard"
      },
      {
        icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
        title: "Admin Command Center",
        description: "A powerful web dashboard for NGOs to monitor all requests, assign volunteers, and manage operations.",
        href: "/admin/dashboard"
      },
      {
        icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
        title: "Inventory Management",
        description: "Track aid supplies, manage stock levels, and get low-stock alerts with our inventory dashboard.",
        href: "/inventory"
      },
      {
        icon: <Smartphone className="h-8 w-8 text-primary" />,
        title: "Real-time Sync",
        description: "Powered by Firebase, all data is synchronized in real-time across all devices.",
        href: "/"
      },
  ];

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
            Request Aid
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/admin/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/volunteer/dashboard"
          >
            Volunteer Tasks
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/chatbot"
          >
            Chatbot
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-1 lg:gap-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-glassy-embossed">
                    Comprehensive Crisis Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                    Complete disaster management solution with real-time inventory tracking, volunteer coordination, and emergency response systems. Built for NGOs and relief organizations.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   <Button asChild size="lg">
                     <Link href="/admin/dashboard">Access Dashboard</Link>
                   </Button>
                   <Button asChild variant="outline" size="lg">
                     <Link href="/victim/dashboard">Request Aid</Link>
                   </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={600}
                  height={400}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-lg mt-8"
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-glassy-embossed">
                  A Faster, More Coordinated Response
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools necessary for effective disaster relief management, from requesting aid to tracking delivery in real-time.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {features.map((feature) => (
                <Link key={feature.title} href={feature.href} className="group">
                  <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full">
                    {feature.icon}
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Transform Crisis Response?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join leading NGOs and relief organizations using DisasterAid to save lives and coordinate efficient emergency responses.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
                <Button asChild size="lg">
                    <Link href="/admin/dashboard">Get Started Now</Link>
                </Button>
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
