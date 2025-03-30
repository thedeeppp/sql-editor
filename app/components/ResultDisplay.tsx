import { QueryResult } from "../types"
import styles from "@/app/editor/editor.module.css"

interface ResultsDisplayProps {
  results: QueryResult | null
  error: string | null
  isLoading: boolean
}

export default function ResultsDisplay({ results, error, isLoading }: ResultsDisplayProps) {
  return (
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
  )
}