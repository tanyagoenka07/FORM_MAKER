"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Send, CheckCircle, Star, TypeIcon as FormIcon } from "lucide-react"

export default function PublicForm() {
  const params = useParams()
  const [form, setForm] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchForm()
  }, [params.id])

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/${params.id}`)
      if (response.ok) {
        const formData = await response.json()
        setForm(formData)
      } else {
        console.error("Form not found")
      }
    } catch (error) {
      console.error("Error fetching form:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    form.fields.forEach((field: any) => {
      if (field.required) {
        const value = formData[field.id]
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = `${field.label} is required`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: params.id,
          responses: formData,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: any) => {
    const fieldError = errors[field.id]

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "url":
      case "number":
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={fieldError ? "border-red-500" : ""}
          />
        )

      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={fieldError ? "border-red-500" : ""}
            rows={4}
          />
        )

      case "select":
        return (
          <Select value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
            <SelectTrigger className={fieldError ? "border-red-500" : ""}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup
            value={formData[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
            className="space-y-2"
          >
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={(formData[field.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = formData[field.id] || []
                    if (checked) {
                      handleInputChange(field.id, [...currentValues, option])
                    } else {
                      handleInputChange(
                        field.id,
                        currentValues.filter((v: string) => v !== option),
                      )
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange(field.id, star)}
                className="transition-colors"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (formData[field.id] || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        )

      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={fieldError ? "border-red-500" : ""}
          />
        )

      case "file":
        return (
          <Input
            id={field.id}
            type="file"
            onChange={(e) => handleInputChange(field.id, e.target.files?.[0]?.name || "")}
            className={fieldError ? "border-red-500" : ""}
          />
        )

      default:
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={fieldError ? "border-red-500" : ""}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FormIcon className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading form...</p>
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
            <CardDescription>The form you're looking for doesn't exist or has been removed.</CardDescription>
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Thank You!</CardTitle>
            <CardDescription>Your response has been submitted successfully.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">We appreciate your time and feedback.</p>
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
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card
            className="shadow-lg"
            style={{
              backgroundColor: form.style?.backgroundColor || "#ffffff",
              color: form.style?.textColor || "#1f2937",
              fontFamily: form.style?.fontFamily || "Inter",
            }}
          >
            <CardHeader>
              <CardTitle className="text-3xl">{form.title}</CardTitle>
              {form.description && <CardDescription className="text-lg">{form.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {form.fields.map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-base font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>

                    {renderField(field)}

                    {errors[field.id] && <p className="text-red-500 text-sm">{errors[field.id]}</p>}
                  </div>
                ))}

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    style={{ backgroundColor: form.style?.primaryColor || "#3b82f6" }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Form
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
