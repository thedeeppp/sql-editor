import { parse } from "csv-parse/sync"
import type { Database } from "sql.js"

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

// Database initialization state
type DatabaseState = {
  instance: Database | null
  isInitializing: boolean
  error: Error | null
}

const state: DatabaseState = {
  instance: null,
  isInitializing: false,
  error: null,
}

// Function to download a file from a URL
async function downloadFile(url: string): Promise<string> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`)
  }

  return await response.text()
}

// Function to parse CSV data and create a table in the database
async function createTableFromCSV(db: Database, tableName: string, csvData: string) {
  try {
    // Parse CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    })

    if (records.length === 0) {
      console.warn(`No records found in ${tableName}.csv`)
      return
    }

    // Get column names from the first record
    const columns = Object.keys(records[0])

    // Create table
    const createTableSQL = `CREATE TABLE ${tableName} (${columns.map((col) => `"${col}" TEXT`).join(", ")})`
    db.exec(createTableSQL)

    // Insert data
    const insertSQL = `INSERT INTO ${tableName} VALUES (${columns.map(() => "?").join(", ")})`
    const stmt = db.prepare(insertSQL)

    for (const record of records) {
      const values = columns.map((col) => record[col])
      stmt.run(values)
    }

    stmt.free()
    console.log(`Table ${tableName} created with ${records.length} records`)
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error)
    throw error
  }
}

// Initialize the database with all tables
async function initializeDatabase(): Promise<Database> {
  try {
    console.log("Initializing database...")

    // Load SQL.js
    const SQL = await import("sql.js")
    const initSqlJs = SQL.default

    // Initialize SQL.js
    const SQL_Module = await initSqlJs({
      // We don't need to specify locateFile since we're using the npm package
    })

    // Create a new database
    const db = new SQL_Module.Database()

    // Download and process each table
    for (const table of TABLES) {
      try {
        console.log(`Loading table ${table}...`)
        const url = `${BASE_URL}/${table}.csv`
        const csvData = await downloadFile(url)
        await createTableFromCSV(db, table, csvData)
      } catch (error) {
        console.error(`Error loading table ${table}:`, error)
        // Continue with other tables even if one fails
      }
    }

    console.log("Database initialization complete")
    return db
  } catch (error) {
    console.error("Database initialization failed:", error)
    throw error
  }
}

// Database singleton with lazy initialization
export const getDatabase = {
  async get(): Promise<Database | null> {
    // If we already have an instance, return it
    if (state.instance) {
      return state.instance
    }

    // If initialization is in progress, wait for it
    if (state.isInitializing) {
      // Wait for initialization to complete
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!state.isInitializing) {
            clearInterval(checkInterval)
            resolve(null)
          }
        }, 100)
      })

      return state.instance
    }

    // Start initialization
    state.isInitializing = true
    state.error = null

    try {
      state.instance = await initializeDatabase()
      return state.instance
    } catch (error) {
      state.error = error instanceof Error ? error : new Error(String(error))
      return null
    } finally {
      state.isInitializing = false
    }
  },

  status(): { isReady: boolean; message: string | null } {
    if (state.instance) {
      return { isReady: true, message: null }
    }

    if (state.isInitializing) {
      return { isReady: false, message: "Database is initializing" }
    }

    if (state.error) {
      return { isReady: false, message: state.error.message }
    }

    return { isReady: false, message: "Database not initialized" }
  },
}

