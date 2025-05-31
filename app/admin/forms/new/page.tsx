"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  Eye,
  Upload,
  Hash,
  Star,
  MapPin,
  Clock,
  LinkIcon,
  FileText,
  Palette,
  Settings,
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
    | "address"
    | "time"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

interface FormStyle {
  primaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
  fontFamily: string
  buttonStyle: string
  spacing: string
}

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type, description: "Single line text" },
  { type: "email", label: "Email", icon: Mail, description: "Email address" },
  { type: "phone", label: "Phone", icon: Phone, description: "Phone number" },
  { type: "textarea", label: "Text Area", icon: FileText, description: "Multi-line text" },
  { type: "select", label: "Dropdown", icon: List, description: "Select from options" },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare, description: "Multiple choices" },
  { type: "radio", label: "Radio Button", icon: Circle, description: "Single choice" },
  { type: "date", label: "Date", icon: Calendar, description: "Date picker" },
  { type: "number", label: "Number", icon: Hash, description: "Numeric input" },
  { type: "file", label: "File Upload", icon: Upload, description: "File attachment" },
  { type: "url", label: "URL", icon: LinkIcon, description: "Website link" },
  { type: "rating", label: "Rating", icon: Star, description: "Star rating" },
  { type: "address", label: "Address", icon: MapPin, description: "Full address" },
  { type: "time", label: "Time", icon: Clock, description: "Time picker" },
]

export default function FormBuilder() {
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [formStyle, setFormStyle] = useState<FormStyle>({
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: "0.375rem",
    fontFamily: "Inter",
    buttonStyle: "rounded",
    spacing: "normal",
  })

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      options: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1", "Option 2"] : undefined,
      validation: {},
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

  const moveField = (id: string, direction: "up" | "down") => {
    const index = fields.findIndex((field) => field.id === id)
    if (index === -1) return

    const newFields = [...fields]
    if (direction === "up" && index > 0) {
      ;[newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]]
    } else if (direction === "down" && index < fields.length - 1) {
      ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
    }
    setFields(newFields)
  }

  const selectedFieldData = fields.find((field) => field.id === selectedField)

  const saveForm = async () => {
    const formData = {
      title: formTitle,
      description: formDescription,
      fields,
      style: formStyle,
      status: "draft",
    }

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Form saved successfully!")
      } else {
        throw new Error("Failed to save form")
      }
    } catch (error) {
      console.error("Error saving form:", error)
      alert("Error saving form. Please try again.")
    }
  }

  const renderFieldPreview = (field: FormField) => {
    const baseClasses = "w-full p-3 border rounded-lg"

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "url":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder || `Enter ${field.type}`}
            disabled
            className={baseClasses}
          />
        )
      case "textarea":
        return (
          <Textarea placeholder={field.placeholder || "Enter your message"} disabled className={baseClasses} rows={3} />
        )
      case "select":
        return (
          <Select disabled>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
          </Select>
        )
      case "date":
        return <Input type="date" disabled className={baseClasses} />
      case "time":
        return <Input type="time" disabled className={baseClasses} />
      case "number":
        return <Input type="number" placeholder="Enter number" disabled className={baseClasses} />
      case "file":
        return <Input type="file" disabled className={baseClasses} />
      case "checkbox":
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input type="checkbox" disabled className="rounded" />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        )
      case "radio":
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
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
      case "address":
        return (
          <div className="space-y-2">
            <Input placeholder="Street Address" disabled className={baseClasses} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="City" disabled className={baseClasses} />
              <Input placeholder="State" disabled className={baseClasses} />
            </div>
          </div>
        )
      default:
        return <Input placeholder={`Enter ${field.type}`} disabled className={baseClasses} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
              <p className="text-gray-600">Create and customize your form</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/forms">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={saveForm} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Form
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar - Form Elements */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Form Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Form Title</Label>
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
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Fields
                </CardTitle>
                <CardDescription>Drag and drop to add fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {fieldTypes.map(({ type, label, icon: Icon, description }) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => addField(type)}
                      className="w-full justify-start h-auto p-3 hover:bg-blue-50 hover:border-blue-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{label}</div>
                          <div className="text-xs text-gray-500">{description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
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
                  className="min-h-96 p-8 rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                  style={{
                    backgroundColor: formStyle.backgroundColor,
                    color: formStyle.textColor,
                    fontFamily: formStyle.fontFamily,
                  }}
                >
                  {/* Form Header */}
                  <div className="mb-8">
                    {formTitle && (
                      <h2 className="text-3xl font-bold mb-3" style={{ color: formStyle.textColor }}>
                        {formTitle}
                      </h2>
                    )}
                    {formDescription && <p className="text-lg text-gray-600 leading-relaxed">{formDescription}</p>}
                  </div>

                  {/* Fields */}
                  {fields.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                      <Type className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="text-xl font-medium mb-2">Start Building Your Form</h3>
                      <p>Add fields from the sidebar to create your form</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className={`group relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedField === field.id
                              ? "border-blue-500 bg-blue-50/50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white"
                          }`}
                          onClick={() => setSelectedField(field.id)}
                        >
                          {/* Field Controls */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                moveField(field.id, "up")
                              }}
                              disabled={index === 0}
                              className="h-8 w-8 p-0"
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                moveField(field.id, "down")
                              }}
                              disabled={index === fields.length - 1}
                              className="h-8 w-8 p-0"
                            >
                              ↓
                            </Button>
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
                          style={{
                            backgroundColor: formStyle.primaryColor,
                            borderRadius: formStyle.borderRadius,
                          }}
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
                <TabsTrigger value="style">
                  <Palette className="h-4 w-4 mr-1" />
                  Style
                </TabsTrigger>
              </TabsList>

              <TabsContent value="properties">
                <Card className="border-0 shadow-lg">
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
                          <input
                            type="checkbox"
                            checked={selectedFieldData.required}
                            onChange={(e) => updateField(selectedFieldData.id, { required: e.target.checked })}
                            className="rounded"
                          />
                          <Label>Required field</Label>
                        </div>

                        {/* Validation Rules */}
                        {(selectedFieldData.type === "text" || selectedFieldData.type === "number") && (
                          <div className="space-y-2">
                            <Label>Validation</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Min Length</Label>
                                <Input
                                  type="number"
                                  placeholder="Min"
                                  value={selectedFieldData.validation?.min || ""}
                                  onChange={(e) =>
                                    updateField(selectedFieldData.id, {
                                      validation: {
                                        ...selectedFieldData.validation,
                                        min: Number.parseInt(e.target.value),
                                      },
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Max Length</Label>
                                <Input
                                  type="number"
                                  placeholder="Max"
                                  value={selectedFieldData.validation?.max || ""}
                                  onChange={(e) =>
                                    updateField(selectedFieldData.id, {
                                      validation: {
                                        ...selectedFieldData.validation,
                                        max: Number.parseInt(e.target.value),
                                      },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}

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
                <Card className="border-0 shadow-lg">
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
                          placeholder="#3b82f6"
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
                          placeholder="#ffffff"
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
                          placeholder="#1f2937"
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
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Border Radius</Label>
                      <Select
                        value={formStyle.borderRadius}
                        onValueChange={(value) => setFormStyle({ ...formStyle, borderRadius: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="0.25rem">Small</SelectItem>
                          <SelectItem value="0.375rem">Medium</SelectItem>
                          <SelectItem value="0.5rem">Large</SelectItem>
                          <SelectItem value="1rem">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Button Style</Label>
                      <Select
                        value={formStyle.buttonStyle}
                        onValueChange={(value) => setFormStyle({ ...formStyle, buttonStyle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="pill">Pill</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Field Spacing</Label>
                      <Select
                        value={formStyle.spacing}
                        onValueChange={(value) => setFormStyle({ ...formStyle, spacing: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="relaxed">Relaxed</SelectItem>
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
