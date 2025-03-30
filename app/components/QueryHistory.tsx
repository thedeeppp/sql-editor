import { QueryHistoryItem } from "../types"
import styles from "@/app/editor/editor.module.css"

interface QueryHistoryProps {
  history: QueryHistoryItem[]
  onSelectQuery: (query: string) => void
  onClearHistory: () => void
}

export default function QueryHistory({ 
  history, 
  onSelectQuery, 
  onClearHistory 
}: QueryHistoryProps) {
  return (
    <div className={styles.historySection}>
      <div className={styles.historyHeader}>
        <h3>Query History</h3>
        {history.length > 0 && (
          <button className={styles.clearHistoryButton} onClick={onClearHistory}>
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className={styles.noHistory}>No query history yet. Execute a query to see it here.</p>
      ) : (
        <div className={styles.historyList}>
          {history.map((historyItem) => (
            <div
              key={historyItem.id}
              className={styles.historyItem}
              onClick={() => onSelectQuery(historyItem.query)}
            >
              <div className={styles.historyQuery}>
                {historyItem.query.length > 60 
                  ? historyItem.query.substring(0, 60) + "..." 
                  : historyItem.query
                }
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
  )
}