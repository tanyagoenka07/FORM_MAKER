"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, CheckCircle, Star, Upload, TypeIcon as FormIcon } from "lucide-react"

// Mock form data - in real app, fetch from API
const mockForm = {
  id: "1",
  title: "Customer Experience Survey",
  description:
    "Help us improve our services by sharing your valuable feedback. Your responses help us serve you better.",
  fields: [
    {
      id: "1",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      id: "2",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      required: true,
    },
    {
      id: "3",
      type: "phone",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      required: false,
    },
    {
      id: "4",
      type: "select",
      label: "How did you hear about us?",
      required: true,
      options: ["Social Media", "Google Search", "Friend Referral", "Advertisement", "Other"],
    },
    {
      id: "5",
      type: "radio",
      label: "Overall Satisfaction Rating",
      required: true,
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
    },
    {
      id: "6",
      type: "checkbox",
      label: "Which services have you used? (Select all that apply)",
      required: false,
      options: ["Customer Support", "Product Consultation", "Technical Support", "Billing Support", "Training"],
    },
    {
      id: "7",
      type: "rating",
      label: "Rate our customer service",
      required: false,
    },
    {
      id: "8",
      type: "textarea",
      label: "Additional Comments & Suggestions",
      placeholder: "Please share any additional feedback, suggestions, or comments",
      required: false,
    },
    {
      id: "9",
      type: "date",
      label: "Date of last service",
      required: false,
    },
  ],
  style: {
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: "0.5rem",
    fontFamily: "Inter",
  },
}

export default function FormView() {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [rating, setRating] = useState<number>(0)

  const form = mockForm // In real app, fetch based on params.id

  const totalSteps = form.fields.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }
  }

  const validateCurrentField = () => {
    const currentField = form.fields[currentStep]
    if (!currentField) return true

    if (currentField.required) {
      const value = formData[currentField.id]
      if (!value || (Array.isArray(value) && value.length === 0)) {
        setErrors({ [currentField.id]: `${currentField.label} is required` })
        return false
      }
    }
    setErrors({})
    return true
  }

  const nextStep = () => {
    if (validateCurrentField() && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    form.fields.forEach((field) => {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: form.id,
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
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`text-lg p-4 ${fieldError ? "border-red-500" : ""}`}
          />
        )

      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`text-lg p-4 min-h-32 ${fieldError ? "border-red-500" : ""}`}
            rows={4}
          />
        )

      case "select":
        return (
          <Select value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
            <SelectTrigger className={`text-lg p-4 h-14 ${fieldError ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option} className="text-lg p-3">
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
            className="space-y-4"
          >
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} className="text-lg" />
                <Label htmlFor={`${field.id}-${option}`} className="text-lg cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-4">
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
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
                <Label htmlFor={`${field.id}-${option}`} className="text-lg cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "rating":
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange(field.id, star)}
                className="transition-colors"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= (formData[field.id] || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            {formData[field.id] && (
              <span className="ml-4 text-lg text-gray-600">{formData[field.id]} out of 5 stars</span>
            )}
          </div>
        )

      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`text-lg p-4 h-14 ${fieldError ? "border-red-500" : ""}`}
          />
        )

      case "time":
        return (
          <Input
            id={field.id}
            type="time"
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`text-lg p-4 h-14 ${fieldError ? "border-red-500" : ""}`}
          />
        )

      case "number":
        return (
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`text-lg p-4 h-14 ${fieldError ? "border-red-500" : ""}`}
          />
        )

      case "file":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Input
              id={field.id}
              type="file"
              onChange={(e) => handleInputChange(field.id, e.target.files?.[0]?.name || "")}
              className="hidden"
            />
            <Label htmlFor={field.id} className="cursor-pointer">
              <span className="text-lg text-blue-600 hover:text-blue-700">Click to upload file</span>
              <p className="text-gray-500 mt-2">or drag and drop</p>
            </Label>
          </div>
        )

      default:
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`text-lg p-4 ${fieldError ? "border-red-500" : ""}`}
          />
        )
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4 border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-6 p-4 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600 mb-2">Thank You!</CardTitle>
            <CardDescription className="text-lg">
              Your form has been submitted successfully. We appreciate your valuable feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2">
                <strong>Submission ID:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-gray-600">You should receive a confirmation email shortly.</p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/forms">
                <Button variant="outline" size="lg">
                  View Other Forms
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentField = form.fields[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/forms"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Forms</span>
            </Link>
            <div className="flex items-center space-x-3">
              <FormIcon className="h-6 w-6 text-blue-600" />
              <Badge variant="secondary">
                Step {currentStep + 1} of {totalSteps}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 min-w-fit">Progress: {Math.round(progress)}%</span>
            <Progress value={progress} className="flex-1 h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card
            className="shadow-2xl border-0"
            style={{
              backgroundColor: form.style.backgroundColor,
              color: form.style.textColor,
              fontFamily: form.style.fontFamily,
            }}
          >
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-4xl font-bold mb-4">{form.title}</CardTitle>
              <CardDescription className="text-xl leading-relaxed">{form.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Current Field */}
                {currentField && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Label htmlFor={currentField.id} className="text-2xl font-semibold block mb-2">
                        {currentField.label}
                        {currentField.required && <span className="text-red-500 ml-2">*</span>}
                      </Label>
                      <p className="text-gray-600">
                        Question {currentStep + 1} of {totalSteps}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-xl">{renderField(currentField)}</div>

                    {errors[currentField.id] && (
                      <p className="text-red-500 text-center font-medium">{errors[currentField.id]}</p>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-8">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0} size="lg">
                    Previous
                  </Button>

                  <div className="flex space-x-2">
                    {form.fields.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentStep ? "bg-blue-600" : index < currentStep ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {currentStep === totalSteps - 1 ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 min-w-32"
                      style={{ backgroundColor: form.style.primaryColor }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Submit Form
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      size="lg"
                      className="min-w-32"
                      style={{ backgroundColor: form.style.primaryColor }}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
