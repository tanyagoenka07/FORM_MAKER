"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Copy, Trash2, Eye, BarChart3, FileText } from "lucide-react"

// Mock data - replace with actual API calls
const mockForms = [
  {
    id: "1",
    title: "Customer Feedback Form",
    description: "Collect customer feedback and suggestions",
    status: "published",
    responses: 45,
    createdAt: "2024-01-15",
    fields: 8,
  },
  {
    id: "2",
    title: "Event Registration",
    description: "Registration form for upcoming events",
    status: "draft",
    responses: 0,
    createdAt: "2024-01-20",
    fields: 12,
  },
  {
    id: "3",
    title: "Contact Us Form",
    description: "General contact and inquiry form",
    status: "published",
    responses: 23,
    createdAt: "2024-01-10",
    fields: 6,
  },
]

export default function FormsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [forms] = useState(mockForms)

  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Forms</h1>
              <p className="text-gray-600">Create, edit, and manage your forms</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Link href="/admin/forms/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Form
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{form.title}</CardTitle>
                    <CardDescription className="mt-2">{form.description}</CardDescription>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>{form.fields} fields</span>
                      <span>{form.responses} responses</span>
                      <span>Created: {form.createdAt}</span>
                    </div>
                  </div>
                  <Badge variant={form.status === "published" ? "default" : "secondary"}>{form.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Link href={`/admin/forms/${form.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/forms/${form.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/admin/forms/${form.id}/responses`}>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Responses ({form.responses})
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first form"}
            </p>
            <Link href="/admin/forms/new">
              <Button>Create Your First Form</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
