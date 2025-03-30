"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { QueryHistoryItem, QueryResult } from "../types"
import { exampleQueries } from "../constants/exampleQueries"
import { loadQueryHistory, saveQueryHistory, clearQueryHistory } from "../utils/localStorage"
import QueryInput from "./queryInput"
import ResultsDisplay from "./ResultDisplay"
import ExampleQueries from "./ExampleQueries"
import QueryHistory from "./QueryHistory"
import styles from "@/app/editor/editor.module.css"

export default function SQLEditor() {
  const [query, setQuery] = useState(exampleQueries[0].query)
  const [results, setResults] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([])

  // Load query history from localStorage on component mount
  useEffect(() => {
    setQueryHistory(loadQueryHistory())
  }, [])

  // Save query history to localStorage whenever it changes
  useEffect(() => {
    saveQueryHistory(queryHistory)
  }, [queryHistory])

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

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
  }

  const handleClearHistory = () => {
    setQueryHistory([])
    clearQueryHistory()
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
        <QueryInput 
          query={query}
          onChange={handleQueryChange}
          onExecute={executeQuery}
          isLoading={isLoading}
        />

        <div className={styles.sideBySideContainer}>
          <ExampleQueries 
            examples={exampleQueries} 
            onSelect={handleQueryChange}
          />
          
          <QueryHistory 
            history={queryHistory}
            onSelectQuery={handleQueryChange}
            onClearHistory={handleClearHistory}
          />
        </div>

        <ResultsDisplay 
          results={results}
          error={error}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}