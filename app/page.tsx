import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modular Fuel App</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Manage Your Fleet
            <span className="text-blue-600"> Efficiently</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A comprehensive modular application for tracking fuel consumption, vehicle maintenance, and fleet management
            with powerful analytics and reporting.
          </p>

          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="mr-4">
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          </SignedIn>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
                <span>Fuel Tracking</span>
              </CardTitle>
              <CardDescription>
                Monitor fuel consumption, costs, and efficiency across your entire fleet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Real-time fuel monitoring</li>
                <li>• Cost analysis and reporting</li>
                <li>• Efficiency metrics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <span>Vehicle Management</span>
              </CardTitle>
              <CardDescription>Complete vehicle lifecycle management with maintenance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Vehicle registration</li>
                <li>• Service scheduling</li>
                <li>• Maintenance history</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
                <span>Analytics & Reports</span>
              </CardTitle>
              <CardDescription>Powerful insights and customizable reports for data-driven decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Interactive dashboards</li>
                <li>• Custom reports</li>
                <li>• Export capabilities</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <SignedOut>
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to optimize your fleet?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of fleet managers who trust our platform
            </p>
            <SignInButton mode="modal">
              <Button size="lg">Start Free Trial</Button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </div>
  )
}
