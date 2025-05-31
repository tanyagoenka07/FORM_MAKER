"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  TypeIcon as FormIcon,
} from "lucide-react"

export default function AdminDashboard() {
  const [forms, setForms] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    publishedForms: 0,
    totalViews: 0,
  })

  useEffect(() => {
    fetchAllForms()
  }, [])

  const fetchAllForms = async () => {
    try {
      const response = await fetch("/api/admin/forms")
      if (response.ok) {
        const formsData = await response.json()
        setForms(formsData)

        // Calculate stats
        const totalForms = formsData.length
        const totalResponses = formsData.reduce((sum: number, form: any) => sum + (form.responses || 0), 0)
        const publishedForms = formsData.filter((form: any) => form.isPublished).length
        const totalViews = formsData.reduce((sum: number, form: any) => sum + (form.views || 0), 0)

        setStats({ totalForms, totalResponses, publishedForms, totalViews })
      }
    } catch (error) {
      console.error("Error fetching forms:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteForm = async (formId: string) => {
    if (!confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setForms(forms.filter((form) => form._id !== formId))
        alert("Form deleted successfully!")
      } else {
        throw new Error("Failed to delete form")
      }
    } catch (error) {
      console.error("Error deleting form:", error)
      alert("Error deleting form. Please try again.")
    }
  }

  const copyFormLink = (formId: string) => {
    const link = `${window.location.origin}/f/${formId}`
    navigator.clipboard.writeText(link)
    alert("Form link copied to clipboard!")
  }

  const duplicateForm = async (form: any) => {
    try {
      const duplicatedForm = {
        ...form,
        title: `${form.title} (Copy)`,
        isPublished: false,
        status: "draft",
      }
      delete duplicatedForm._id
      delete duplicatedForm.createdAt
      delete duplicatedForm.updatedAt
      delete duplicatedForm.responses
      delete duplicatedForm.views

      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicatedForm),
      })

      if (response.ok) {
        fetchAllForms()
        alert("Form duplicated successfully!")
      } else {
        throw new Error("Failed to duplicate form")
      }
    } catch (error) {
      console.error("Error duplicating form:", error)
      alert("Error duplicating form. Please try again.")
    }
  }

  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FormIcon className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <FormIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <Badge variant="secondary">Form Maker</Badge>
              </div>
              <p className="text-gray-600">Manage all your forms and view analytics</p>
            </div>
            <div className="flex gap-3">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Link href="/create">
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Forms</CardTitle>
              <FileText className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.totalForms}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                All forms created
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Responses</CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{stats.totalResponses}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Across all forms
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Published Forms</CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{stats.publishedForms}</div>
              <p className="text-xs text-purple-600">Currently live</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Total Views</CardTitle>
              <Eye className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.totalViews}</div>
              <p className="text-xs text-orange-600">Form page views</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search forms by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Forms Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">All Forms ({filteredForms.length})</CardTitle>
                <CardDescription>Manage your forms and view analytics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredForms.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No forms found" : "No forms created yet"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first form"}
                </p>
                <Link href="/create">
                  <Button>Create Your First Form</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responses</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForms.map((form) => (
                      <TableRow key={form._id}>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">{form.title}</div>
                            <div className="text-sm text-gray-500">{form.description || "No description"}</div>
                            <div className="text-xs text-gray-400 mt-1">{form.fields?.length || 0} fields</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={form.isPublished ? "default" : "secondary"}>
                            {form.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            {form.responses || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-gray-400" />
                            {form.views || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">{new Date(form.createdAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {form.isPublished && (
                              <>
                                <Link href={`/f/${form._id}`} target="_blank">
                                  <Button variant="ghost" size="sm" title="View Form">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyFormLink(form._id)}
                                  title="Copy Link"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Link href={`/responses/${form._id}`}>
                                  <Button variant="ghost" size="sm" title="View Responses">
                                    <BarChart3 className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </>
                            )}
                            <Link href={`/edit/${form._id}`}>
                              <Button variant="ghost" size="sm" title="Edit Form">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateForm(form)}
                              title="Duplicate Form"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteForm(form._id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete Form"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
