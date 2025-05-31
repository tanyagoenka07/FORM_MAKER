"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Filter, Calendar, BarChart3 } from "lucide-react"

// Mock data - replace with actual API calls
const mockResponses = [
  {
    id: "1",
    formTitle: "Customer Feedback Form",
    submittedAt: "2024-01-25 14:30",
    submitterEmail: "john@example.com",
    responses: {
      Name: "John Doe",
      Email: "john@example.com",
      Rating: "5 stars",
      Feedback: "Great service!",
    },
  },
  {
    id: "2",
    formTitle: "Contact Us Form",
    submittedAt: "2024-01-25 12:15",
    submitterEmail: "jane@example.com",
    responses: {
      Name: "Jane Smith",
      Email: "jane@example.com",
      Subject: "Product Inquiry",
      Message: "I would like to know more about your products.",
    },
  },
  {
    id: "3",
    formTitle: "Customer Feedback Form",
    submittedAt: "2024-01-24 16:45",
    submitterEmail: "bob@example.com",
    responses: {
      Name: "Bob Johnson",
      Email: "bob@example.com",
      Rating: "4 stars",
      Feedback: "Good experience overall.",
    },
  },
]

const mockForms = [
  { id: "1", title: "Customer Feedback Form" },
  { id: "2", title: "Contact Us Form" },
  { id: "3", title: "Event Registration" },
]

export default function ResponsesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedForm, setSelectedForm] = useState("all")
  const [responses] = useState(mockResponses)

  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.submitterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.formTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesForm = selectedForm === "all" || response.formTitle === selectedForm
    return matchesSearch && matchesForm
  })

  const exportData = () => {
    // Convert responses to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Form,Submitted At,Email,Responses\n" +
      filteredResponses
        .map(
          (response) =>
            `"${response.formTitle}","${response.submittedAt}","${response.submitterEmail}","${JSON.stringify(response.responses).replace(/"/g, '""')}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "form_responses.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Form Responses</h1>
              <p className="text-gray-600">View and analyze collected form data</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Button onClick={exportData} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{responses.length}</div>
              <p className="text-xs text-muted-foreground">Across all forms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Responses</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">+100% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockForms.length}</div>
              <p className="text-xs text-muted-foreground">Currently collecting data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5m</div>
              <p className="text-xs text-muted-foreground">Time to complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by email or form name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedForm} onValueChange={setSelectedForm}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  {mockForms.map((form) => (
                    <SelectItem key={form.id} value={form.title}>
                      {form.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Responses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Responses ({filteredResponses.length})</CardTitle>
            <CardDescription>Click on a response to view detailed information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Response Summary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponses.map((response) => (
                  <TableRow key={response.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{response.formTitle}</div>
                        <Badge variant="secondary" className="mt-1">
                          {Object.keys(response.responses).length} fields
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{response.submitterEmail}</TableCell>
                    <TableCell>{response.submittedAt}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {Object.entries(response.responses)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <div key={key} className="text-sm text-gray-600 truncate">
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        {Object.keys(response.responses).length > 2 && (
                          <div className="text-sm text-gray-400">
                            +{Object.keys(response.responses).length - 2} more fields
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredResponses.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No responses found</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedForm !== "all"
                    ? "Try adjusting your filters"
                    : "Responses will appear here once users start submitting your forms"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
