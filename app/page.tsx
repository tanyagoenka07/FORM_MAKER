import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TypeIcon as FormIcon, BarChart3, Settings, Zap, Shield, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FormIcon className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Form Maker</span>
              <Badge variant="secondary">Live</Badge>
            </div>
            <div className="flex gap-3">
              <Link href="/forms">
                <Button variant="outline">Browse Forms</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">Admin Dashboard</Button>
              </Link>
              <Link href="/create">
                <Button className="bg-blue-600 hover:bg-blue-700">Create Form</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Real Form Builder - Actually Works!
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Real Forms
            <br />
            <span className="text-blue-600">Get Real Responses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Build professional forms, publish them with unique links, and collect real responses in your MongoDB
            database. No fake data - everything is real and functional.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/create">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Start Creating Forms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/forms">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                View Live Forms
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="text-center border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <FormIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Real Form Builder</h3>
              <p className="text-gray-600 text-sm">Actually saves to MongoDB</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Unique Links</h3>
              <p className="text-gray-600 text-sm">Each form gets shareable URL</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Real Responses</h3>
              <p className="text-gray-600 text-sm">View in spreadsheet format</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Settings className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Full Customization</h3>
              <p className="text-gray-600 text-sm">Colors, fonts, styling</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Create Your First Form?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Start building professional forms that actually work and save real data
          </p>
          <Link href="/create">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
              Create Form Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FormIcon className="h-6 w-6" />
            <span className="text-xl font-bold">Form Maker</span>
          </div>
          <p className="text-gray-400">Real forms, real responses, real results.</p>
        </div>
      </footer>
    </div>
  )
}
