import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const formId = searchParams.get("formId")

    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
    }

    if (!ObjectId.isValid(formId)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 })
    }

    const responses = await db
      .collection("responses")
      .find({ formId: new ObjectId(formId) })
      .sort({ submittedAt: -1 })
      .toArray()

    return NextResponse.json(responses)
  } catch (error) {
    console.error("Error fetching responses:", error)
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
  }
}
