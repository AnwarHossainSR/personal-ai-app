import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg flex items-center justify-center shadow-lg">
                <Image
                  src="/logo.svg"
                  alt="FuelApp Logo"
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold font-heading text-foreground">
                  FuelApp
                </h1>
                <p className="text-xs text-muted-foreground">
                  Professional Fleet Management
                </p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/fuel-log"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Fuel Logs
                </Link>
                <Link
                  href="/admin"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Admin
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-accent bg-transparent"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </SignInButton>
              </SignedOut>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black font-heading text-foreground mb-6 leading-tight">
              Professional Fleet
              <span className="text-primary block">Management System</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Streamline your fleet operations with our comprehensive fuel
              tracking, vehicle management, and analytics platform designed for
              modern businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="px-8 py-3 text-base font-semibold"
                  >
                    Start Free Trial
                  </Button>
                </SignInButton>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-base font-semibold bg-transparent"
                >
                  View Demo
                </Button>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="px-8 py-3 text-base font-semibold"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/fuel-log">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-base font-semibold bg-transparent"
                  >
                    Manage Fleet
                  </Button>
                </Link>
              </SignedIn>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Multi-User Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Advanced Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold font-heading text-foreground mb-4">
              Comprehensive Fleet Management Modules
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modular architecture allows you to use only what you need, when
              you need it
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 bg-card">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-heading text-foreground">
                  Fuel Management
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Comprehensive fuel tracking with real-time monitoring and cost
                  optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Real-time fuel consumption tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Cost analysis and budget forecasting</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>Efficiency metrics and optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 bg-card">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl font-heading text-foreground">
                  Vehicle Operations
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Complete vehicle lifecycle management with predictive
                  maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    <span>Vehicle registration and documentation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    <span>Automated service scheduling</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    <span>Maintenance history and compliance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 bg-card">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-chart-3/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle className="text-xl font-heading text-foreground">
                  Advanced Analytics
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Data-driven insights with customizable reporting and
                  dashboards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-chart-3 rounded-full"></div>
                    <span>Interactive dashboards and KPIs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-chart-3 rounded-full"></div>
                    <span>Custom reports and data export</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-chart-3 rounded-full"></div>
                    <span>Predictive analytics and forecasting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SignedOut>
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center bg-card rounded-2xl p-12 shadow-lg border">
              <h3 className="text-4xl font-bold font-heading text-foreground mb-6">
                Ready to Transform Your Fleet Operations?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join industry leaders who trust FuelApp to optimize their fleet
                management and reduce operational costs by up to 30%.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="px-8 py-3 text-base font-semibold"
                  >
                    Start Free Trial
                  </Button>
                </SignInButton>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-base font-semibold bg-transparent"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </SignedOut>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-card/20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-heading text-foreground">
              FuelApp
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FuelApp. Professional Fleet Management Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
