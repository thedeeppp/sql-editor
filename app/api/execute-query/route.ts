import { type NextRequest, NextResponse } from "next/server"
import { parse } from "csv-parse/sync"
import alasql from "alasql"

// Base URL for the CSV files
const BASE_URL =
  "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv"

// List of tables in the Northwind dataset
const TABLES = [
  "categories",
  "customers",
  "employees",
  "order_details",
  "orders",
  "products",
  "regions",
  "shippers",
  "suppliers",
  "territories",
]

// Cache for loaded tables
const tableCache: Record<string, any[]> = {}

// Function to download a file from a URL
async function downloadFile(url: string): Promise<string> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`)
  }

  return await response.text()
}

// Function to load a table from CSV
async function loadTable(tableName: string): Promise<any[]> {
  // Check if table is already cached
  if (tableCache[tableName]) {
    return tableCache[tableName]
  }

  try {
    // Download CSV file
    const url = `${BASE_URL}/${tableName}.csv`
    const csvData = await downloadFile(url)

    // Parse CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    })

    // Cache the table data
    tableCache[tableName] = records

    // Register the table with AlaSQL
    alasql.tables[tableName] = {
      data: records,
    }

    return records
  } catch (error) {
    console.error(`Error loading table ${tableName}:`, error)
    throw error
  }
}

// Initialize AlaSQL with all tables
async function initializeDatabase(): Promise<void> {
  for (const table of TABLES) {
    await loadTable(table)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    // Initialize database if not already done
    await initializeDatabase()

    // Execute the query
    const startTime = performance.now()
    let result

    try {
      result = alasql(query)
    } catch (queryError) {
      return NextResponse.json(
        { error: `SQL Error: ${queryError instanceof Error ? queryError.message : String(queryError)}` },
        { status: 400 },
      )
    }

    const executionTime = Math.round(performance.now() - startTime)

    // Get column names from the first result (if any)
    let columns: string[] = []
    if (Array.isArray(result) && result.length > 0) {
      columns = Object.keys(result[0] || {})
    }

    // Convert result objects to arrays for consistent rendering
    const rows = Array.isArray(result) ? result.map((row) => columns.map((col) => row[col])) : []

    return NextResponse.json({
      columns,
      rows,
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

