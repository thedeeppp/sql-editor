import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

// Define types for the database result
interface DatabaseResult {
  columns: string[]
  values: any[][]
}

// Define types for formatted results
interface FormattedResult {
  columns: string[]
  rows: Record<string, any>[]
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    const db = await getDatabase.get()

    if (!db) {
      return NextResponse.json({ error: "Database is not ready yet. Please try again later." }, { status: 503 })
    }

    // Execute the query
    const startTime = performance.now()
    let results: DatabaseResult[];

    try {
      results = db.exec(query)
    } catch (queryError) {
      return NextResponse.json(
        { error: `SQL Error: ${queryError instanceof Error ? queryError.message : String(queryError)}` },
        { status: 400 },
      )
    }

    const executionTime = Math.round(performance.now() - startTime)

    // Format the results with TypeScript type safety
    const formattedResults: FormattedResult[] = results.map((result: DatabaseResult) => {
      // Ensure result has values and columns before processing
      if (!result.values || !result.columns) {
        return { columns: [], rows: [] }
      }

      const rows = result.values.map((rowValues: any[]) => {
        const row: Record<string, any> = {}
        result.columns.forEach((columnName: string, index: number) => {
          row[columnName] = rowValues[index]
        })
        return row
      })

      return { columns: result.columns, rows }
    })

    // Handle cases where no results are returned
    return NextResponse.json({
      rows: formattedResults.length > 0 ? formattedResults[0].rows : [],
      columns: formattedResults.length > 0 ? formattedResults[0].columns : [],
      executionTime,
    })
  } catch (error) {
    console.error("Error executing query:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}