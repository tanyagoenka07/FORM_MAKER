"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, BarChart3, Calendar, Users } from "lucide-react"

export default function FormResponses() {
  const params = useParams()
  const [form, setForm] = useState<any>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFormAndResponses()
  }, [params.id])

  const fetchFormAndResponses = async () => {
    try {
      // Fetch form details
      const formResponse = await fetch(`/api/forms/${params.id}`)
      if (formResponse.ok) {
        const formData = await formResponse.json()
        setForm(formData)
      }

      // Fetch responses
      const responsesResponse = await fetch(`/api/responses?formId=${params.id}`)
      if (responsesResponse.ok) {
        const responsesData = await responsesResponse.json()
        setResponses(responsesData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!form || responses.length === 0) return

    // Create CSV headers
    const headers = ["Submission Date", ...form.fields.map((field: any) => field.label)]

    // Create CSV rows
    const rows = responses.map((response) => [
      new Date(response.submittedAt).toLocaleString(),
      ...form.fields.map((field: any) => {
        const value = response.responses[field.id]
        if (Array.isArray(value)) {
          return value.join(", ")
        }
        return value || ""
      }),
    ])

    // Combine headers and rows
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.title}_responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading responses...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Form Not Found</CardTitle>
            <CardDescription>The form you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/create" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Form Builder
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{form.title} - Responses</h1>
              <p className="text-gray-600">View and analyze form responses</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/f/${params.id}`} target="_blank">
                <Button variant="outline">View Form</Button>
              </Link>
              <Button onClick={exportToCSV} disabled={responses.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{responses.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Form Fields</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{form.fields.length}</div>
              <p className="text-xs text-muted-foreground">Total fields</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Response</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {responses.length > 0 ? new Date(responses[0].submittedAt).toLocaleDateString() : "None"}
              </div>
              <p className="text-xs text-muted-foreground">Most recent</p>
            </CardContent>
          </Card>
        </div>

        {/* Responses Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Form Responses</CardTitle>
                <CardDescription>All responses submitted to this form</CardDescription>
              </div>
              <Badge variant="secondary">{responses.length} responses</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {responses.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
                <p className="text-gray-600 mb-4">Responses will appear here once users start submitting your form</p>
                <Link href={`/f/${params.id}`} target="_blank">
                  <Button>View Form</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submitted At</TableHead>
                      {form.fields.map((field: any) => (
                        <TableHead key={field.id}>{field.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{new Date(response.submittedAt).toLocaleString()}</TableCell>
                        {form.fields.map((field: any) => (
                          <TableCell key={field.id}>
                            {Array.isArray(response.responses[field.id])
                              ? response.responses[field.id].join(", ")
                              : response.responses[field.id] || "-"}
                          </TableCell>
                        ))}
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
