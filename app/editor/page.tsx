"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import styles from "./editor.module.css"

// Type for query history items
interface QueryHistoryItem {
  id: string
  query: string
  timestamp: Date
  executionTime?: number
  rowCount?: number
}

// Type for example queries
interface ExampleQuery {
  id: number
  name: string
  description: string
  query: string
}

export default function SQLEditor() {
  // Sample example queries
  const exampleQueries: ExampleQuery[] = [
    {
      id: 1,
      name: "Basic Select",
      description: "Get the first 10 products",
      query: "SELECT * FROM products;"
    },
    {
      id: 2,
      name: "Products by Category",
      description: "Count products per category with sorting",
      query: "SELECT c.category_name, COUNT(p.product_id) as product_count\nFROM categories c\nJOIN products p ON c.category_id = p.category_id\nGROUP BY c.category_name\nORDER BY product_count DESC;"
    },
    {
      id: 3,
      name: "Count number of products",
      description: "Count total number of products in the table",
      query: "select count (*) from products;"
    },
    {
      id: 4,
      name: "Revenue Analysis",
      description: "Calculate monthly revenue for the current year",
      query: "SELECT\n  EXTRACT(MONTH FROM order_date) as month,\n  SUM(unit_price * quantity * (1 - discount)) as revenue\nFROM order_details od\nJOIN orders o ON od.order_id = o.order_id\nWHERE EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)\nGROUP BY month\nORDER BY month;"
    }
  ]

  const [query, setQuery] = useState(exampleQueries[0].query)
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([])

  // Load query history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("queryHistory")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        // Convert string timestamps back to Date objects
        const formattedHistory = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setQueryHistory(formattedHistory)
      } catch (e) {
        console.error("Failed to parse query history:", e)
      }
    }
  }, [])

  // Save query history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("queryHistory", JSON.stringify(queryHistory))
  }, [queryHistory])

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value)
  }

  const executeQuery = async () => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch("/api/execute-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute query")
      }

      setResults(data)

      // Add to query history
      const historyItem: QueryHistoryItem = {
        id: Date.now().toString(),
        query: query,
        timestamp: new Date(),
        executionTime: data.executionTime,
        rowCount: data.rows ? data.rows.length : 0,
      }

      setQueryHistory((prev) => [historyItem, ...prev.slice(0, 19)]) // Keep only the 20 most recent queries
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const loadQueryFromHistory = (historyItem: QueryHistoryItem) => {
    setQuery(historyItem.query)
  }

  const clearHistory = () => {
    setQueryHistory([])
    localStorage.removeItem("queryHistory")
  }

  const setExampleQuery = (exampleQuery: string) => {
    setQuery(exampleQuery)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>SQL Editor</h1>
        <Link href="/" className={styles.backLink}>
          Back to Home
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.editorContainer}>
          <div className={styles.editorHeader}>
            <h2>Write your SQL query</h2>
            <button className={styles.executeButton} onClick={executeQuery} disabled={isLoading}>
              {isLoading ? "Executing..." : "Execute Query"}
            </button>
          </div>

          <textarea
            className={styles.queryEditor}
            value={query}
            onChange={handleQueryChange}
            placeholder="Enter your SQL query here..."
            spellCheck={false}
          />

          <div className={styles.sideBySideContainer}>
            {/* Example Queries Section */}
            <div className={styles.examplesSection}>
              <div className={styles.sectionHeader}>
                <h3>Example Queries</h3>
              </div>
              <div className={styles.examplesList}>
                {exampleQueries.map((example) => (
                  <div 
                    key={example.id} 
                    className={styles.exampleItem}
                    onClick={() => setExampleQuery(example.query)}
                  >
                    <div className={styles.exampleTitle}>{example.name}</div>
                    <div className={styles.exampleDescription}>{example.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Query History Section */}
            <div className={styles.historySection}>
              <div className={styles.historyHeader}>
                <h3>Query History</h3>
                {queryHistory.length > 0 && (
                  <button className={styles.clearHistoryButton} onClick={clearHistory}>
                    Clear History
                  </button>
                )}
              </div>

              {queryHistory.length === 0 ? (
                <p className={styles.noHistory}>No query history yet. Execute a query to see it here.</p>
              ) : (
                <div className={styles.historyList}>
                  {queryHistory.map((historyItem) => (
                    <div
                      key={historyItem.id}
                      className={styles.historyItem}
                      onClick={() => loadQueryFromHistory(historyItem)}
                    >
                      <div className={styles.historyQuery}>
                        {historyItem.query.length > 60 ? historyItem.query.substring(0, 60) + "..." : historyItem.query}
                      </div>
                      <div className={styles.historyMeta}>
                        <span>{historyItem.timestamp.toLocaleTimeString()}</span>
                        <span>{historyItem.executionTime}ms</span>
                        <span>{historyItem.rowCount} rows</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.resultsContainer}>
          <h2>Results</h2>

          {error && (
            <div className={styles.error}>
              <p>Error: {error}</p>
            </div>
          )}

          {isLoading && (
            <div className={styles.loading}>
              <p>Executing query...</p>
            </div>
          )}

          {results && !error && !isLoading && (
            <>
              {results.columns && results.columns.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.resultsTable}>
                    <thead>
                      <tr>
                        {results.columns.map((column: string, index: number) => (
                          <th key={index}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.rows.map((row: any[], rowIndex: number) => (
                        <tr key={rowIndex}>
                          {row.map((cell: any, cellIndex: number) => (
                            <td key={cellIndex}>{cell === null ? "NULL" : String(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={styles.noResults}>No results found</p>
              )}

              <div className={styles.queryStats}>
                <p>Query executed in {results.executionTime}ms</p>
                <p>{results.rows ? results.rows.length : 0} rows returned</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}