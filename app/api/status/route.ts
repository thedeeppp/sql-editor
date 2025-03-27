import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function GET() {
  try {
    const { isReady, message } = await getDatabase.status()

    return NextResponse.json({
      ready: isReady,
      message: message || null,
    })
  } catch (error) {
    console.error("Error checking database status:", error)
    return NextResponse.json(
      {
        ready: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}

