import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    // Get ALL forms for admin (both published and draft)
    const forms = await db.collection("forms").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(forms)
  } catch (error) {
    console.error("Error fetching admin forms:", error)
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
  }
}
