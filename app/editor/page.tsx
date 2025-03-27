"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import styles from "./editor.module.css"

export default function SQLEditor() {
  const [query, setQuery] = useState("SELECT * FROM products LIMIT 10;")
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
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

          <div className={styles.examples}>
            <h3>Example Queries:</h3>
            <ul>
              <li onClick={() => setQuery("SELECT * FROM products LIMIT 10;")}>SELECT * FROM products LIMIT 10;</li>
              <li
                onClick={() =>
                  setQuery(
                    "SELECT c.category_name, COUNT(p.product_id) as product_count\nFROM categories c\nJOIN products p ON c.category_id = p.category_id\nGROUP BY c.category_name\nORDER BY product_count DESC;",
                  )
                }
              >
                Count products by category
              </li>
              <li
                onClick={() =>
                  setQuery(
                    "SELECT c.company_name, COUNT(o.order_id) as order_count\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.company_name\nORDER BY order_count DESC\nLIMIT 5;",
                  )
                }
              >
                Top 5 customers by order count
              </li>
            </ul>
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

