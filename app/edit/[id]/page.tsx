"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  Circle,
  List,
  Save,
  Upload,
  Hash,
  Star,
  LinkIcon,
  FileText,
  Settings,
  Globe,
  Copy,
  ExternalLink,
  BarChart3,
  ArrowLeft,
} from "lucide-react"

interface FormField {
  id: string
  type:
    | "text"
    | "email"
    | "phone"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "number"
    | "file"
    | "url"
    | "rating"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface FormStyle {
  primaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
  fontFamily: string
}

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Phone", icon: Phone },
  { type: "textarea", label: "Text Area", icon: FileText },
  { type: "select", label: "Dropdown", icon: List },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "radio", label: "Radio Button", icon: Circle },
  { type: "date", label: "Date", icon: Calendar },
  { type: "number", label: "Number", icon: Hash },
  { type: "file", label: "File Upload", icon: Upload },
  { type: "url", label: "URL", icon: LinkIcon },
  { type: "rating", label: "Rating", icon: Star },
]

export default function EditForm() {
  const params = useParams()
  const router = useRouter()
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [isPublished, setIsPublished] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formStyle, setFormStyle] = useState<FormStyle>({
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: "0.375rem",
    fontFamily: "Inter",
  })

  useEffect(() => {
    fetchForm()
  }, [params.id])

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/${params.id}`)
      if (response.ok) {
        const form = await response.json()
        setFormTitle(form.title)
        setFormDescription(form.description || "")
        setFields(form.fields || [])
        setIsPublished(form.isPublished || false)
        setFormStyle(form.style || formStyle)
      } else {
        alert("Form not found")
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error fetching form:", error)
      alert("Error loading form")
      router.push("/admin")
    } finally {
      setLoading(false)
    }
  }

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      options: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1", "Option 2"] : undefined,
    }
    setFields([...fields, newField])
    setSelectedField(newField.id)
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
    if (selectedField === id) {
      setSelectedField(null)
    }
  }

  const saveForm = async (publish = false) => {
    if (!formTitle.trim()) {
      alert("Please enter a form title")
      return
    }

    if (fields.length === 0) {
      alert("Please add at least one field to your form")
      return
    }

    setIsSaving(true)

    try {
      const formData = {
        title: formTitle,
        description: formDescription,
        fields,
        style: formStyle,
        status: publish ? "published" : "draft",
        isPublished: publish,
      }

      const response = await fetch(`/api/forms/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update form")
      }

      setIsPublished(publish)

      if (publish) {
        alert(`Form updated and published! Share this link: ${window.location.origin}/f/${params.id}`)
      } else {
        alert("Form updated successfully!")
      }
    } catch (error) {
      console.error("Error updating form:", error)
      alert("Error updating form. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const publishForm = () => saveForm(true)

  const copyFormLink = () => {
    const link = `${window.location.origin}/f/${params.id}`
    navigator.clipboard.writeText(link)
    alert("Form link copied to clipboard!")
  }

  const selectedFieldData = fields.find((field) => field.id === selectedField)

  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "url":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder || `Enter ${field.type}`}
            disabled
            className="w-full"
          />
        )
      case "textarea":
        return <Textarea placeholder={field.placeholder || "Enter your message"} disabled className="w-full" />
      case "select":
        return (
          <Select disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
          </Select>
        )
      case "date":
        return <Input type="date" disabled className="w-full" />
      case "file":
        return <Input type="file" disabled className="w-full" />
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        )
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.id} disabled />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        )
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 text-gray-300" />
            ))}
          </div>
        )
      default:
        return <Input placeholder={`Enter ${field.type}`} disabled className="w-full" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Form</h1>
              <p className="text-gray-600">Update your form</p>
            </div>
            <div className="flex gap-2">
              {isPublished && (
                <>
                  <Button variant="outline" onClick={copyFormLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Link href={`/f/${params.id}`} target="_blank">
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Form
                    </Button>
                  </Link>
                  <Link href={`/responses/${params.id}`}>
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Responses
                    </Button>
                  </Link>
                </>
              )}
              <Button onClick={() => saveForm(false)} disabled={isSaving} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
              <Button onClick={publishForm} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                <Globe className="h-4 w-4 mr-2" />
                {isSaving ? "Publishing..." : isPublished ? "Update & Publish" : "Publish Form"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar - Form Elements */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Form Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Form Title *</Label>
                  <Input
                    id="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter form title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter form description"
                    rows={3}
                  />
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">{isPublished ? "Published" : "Draft"}</span>
                    <Badge variant={isPublished ? "default" : "secondary"}>{isPublished ? "Live" : "Draft"}</Badge>
                  </div>
                  {isPublished && <p className="text-xs text-blue-600 mt-1">Form ID: {params.id}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fieldTypes.map(({ type, label, icon: Icon }) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => addField(type)}
                      className="w-full justify-start h-auto p-3"
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{label}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Form Preview</CardTitle>
                    <CardDescription>
                      {fields.length} field{fields.length !== 1 ? "s" : ""} • Click to edit
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{fields.length} Fields</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-96 p-8 rounded-xl border-2 border-dashed border-gray-200"
                  style={{
                    backgroundColor: formStyle.backgroundColor,
                    color: formStyle.textColor,
                    fontFamily: formStyle.fontFamily,
                  }}
                >
                  {/* Form Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-3">{formTitle}</h2>
                    {formDescription && <p className="text-lg text-gray-600">{formDescription}</p>}
                  </div>

                  {/* Fields */}
                  {fields.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                      <Type className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="text-xl font-medium mb-2">Add Fields to Your Form</h3>
                      <p>Select field types from the sidebar to build your form</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {fields.map((field) => (
                        <div
                          key={field.id}
                          className={`group relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedField === field.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                          onClick={() => setSelectedField(field.id)}
                        >
                          {/* Field Controls */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteField(field.id)
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Field Label */}
                          <div className="flex items-center mb-3">
                            <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                            <Label className="font-semibold text-base">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                          </div>

                          {/* Field Preview */}
                          {renderFieldPreview(field)}
                        </div>
                      ))}

                      {/* Submit Button Preview */}
                      <div className="pt-6">
                        <Button
                          className="w-full py-4 text-lg font-semibold"
                          style={{ backgroundColor: formStyle.primaryColor }}
                          disabled
                        >
                          Submit Form
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="properties" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              <TabsContent value="properties">
                <Card>
                  <CardHeader>
                    <CardTitle>Field Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedFieldData ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Field Label</Label>
                          <Input
                            value={selectedFieldData.label}
                            onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label>Placeholder</Label>
                          <Input
                            value={selectedFieldData.placeholder || ""}
                            onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedFieldData.required}
                            onCheckedChange={(checked) => updateField(selectedFieldData.id, { required: checked })}
                          />
                          <Label>Required field</Label>
                        </div>

                        {/* Options for select, radio, checkbox */}
                        {(selectedFieldData.type === "select" ||
                          selectedFieldData.type === "radio" ||
                          selectedFieldData.type === "checkbox") && (
                          <div>
                            <Label>Options</Label>
                            <div className="space-y-2">
                              {selectedFieldData.options?.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(selectedFieldData.options || [])]
                                      newOptions[index] = e.target.value
                                      updateField(selectedFieldData.id, { options: newOptions })
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newOptions = selectedFieldData.options?.filter((_, i) => i !== index)
                                      updateField(selectedFieldData.id, { options: newOptions })
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newOptions = [
                                    ...(selectedFieldData.options || []),
                                    `Option ${(selectedFieldData.options?.length || 0) + 1}`,
                                  ]
                                  updateField(selectedFieldData.id, { options: newOptions })
                                }}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Settings className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>Select a field to edit its properties</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Styling</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={formStyle.primaryColor}
                          onChange={(e) => setFormStyle({ ...formStyle, primaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={formStyle.primaryColor}
                          onChange={(e) => setFormStyle({ ...formStyle, primaryColor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Background Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={formStyle.backgroundColor}
                          onChange={(e) => setFormStyle({ ...formStyle, backgroundColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={formStyle.backgroundColor}
                          onChange={(e) => setFormStyle({ ...formStyle, backgroundColor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Text Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={formStyle.textColor}
                          onChange={(e) => setFormStyle({ ...formStyle, textColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={formStyle.textColor}
                          onChange={(e) => setFormStyle({ ...formStyle, textColor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Font Family</Label>
                      <Select
                        value={formStyle.fontFamily}
                        onValueChange={(value) => setFormStyle({ ...formStyle, fontFamily: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
