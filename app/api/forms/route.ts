import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const forms = await db.collection("forms").find({ isPublished: true }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(forms)
  } catch (error) {
    console.error("Error fetching forms:", error)
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const formData = await request.json()

    // Validate required fields
    if (!formData.title?.trim()) {
      return NextResponse.json({ error: "Form title is required" }, { status: 400 })
    }

    if (!formData.fields || formData.fields.length === 0) {
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 })
    }

    // Validate each field
    for (const field of formData.fields) {
      if (!field.label?.trim()) {
        return NextResponse.json({ error: "All fields must have a label" }, { status: 400 })
      }
    }

    const newForm = {
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
      fields: formData.fields,
      style: formData.style || {
        primaryColor: "#3b82f6",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        borderRadius: "0.375rem",
        fontFamily: "Inter",
      },
      status: formData.status || "draft",
      isPublished: formData.isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: 0,
      views: 0,
    }

    const result = await db.collection("forms").insertOne(newForm)

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      ...newForm,
      _id: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating form:", error)
    return NextResponse.json(
      { error: "Failed to create form. Please check your database connection." },
      { status: 500 },
    )
  }
}
