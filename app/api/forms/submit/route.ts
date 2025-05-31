import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { formId, responses, submittedAt } = await request.json()

    // Validate required fields
    if (!formId || !responses) {
      return NextResponse.json({ error: "Form ID and responses are required" }, { status: 400 })
    }

    if (!ObjectId.isValid(formId)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 })
    }

    // Check if form exists and is published
    const form = await db.collection("forms").findOne({
      _id: new ObjectId(formId),
      isPublished: true,
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found or not published" }, { status: 404 })
    }

    // Save the response
    const responseData = {
      formId: new ObjectId(formId),
      responses,
      submittedAt: new Date(submittedAt || new Date()),
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    const responseResult = await db.collection("responses").insertOne(responseData)

    // Update form response count
    await db.collection("forms").updateOne(
      { _id: new ObjectId(formId) },
      {
        $inc: { responses: 1 },
        $set: { lastResponse: new Date() },
      },
    )

    return NextResponse.json({
      success: true,
      responseId: responseResult.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error submitting form:", error)
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
  }
}
