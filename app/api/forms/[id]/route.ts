import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 })
    }

    const form = await db.collection("forms").findOne({ _id: new ObjectId(params.id) })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Increment view count
    await db.collection("forms").updateOne({ _id: new ObjectId(params.id) }, { $inc: { views: 1 } })

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error fetching form:", error)
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const updates = await request.json()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 })
    }

    const result = await db.collection("forms").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating form:", error)
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 })
    }

    const result = await db.collection("forms").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Also delete all responses for this form
    await db.collection("responses").deleteMany({ formId: new ObjectId(params.id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting form:", error)
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 })
  }
}
