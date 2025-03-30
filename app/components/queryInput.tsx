import { useState, useEffect } from "react"
import styles from "@/app/editor/editor.module.css"

interface QueryInputProps {
  query: string
  onChange: (query: string) => void
  onExecute: () => void
  isLoading: boolean
}

export default function QueryInput({ query, onChange, onExecute, isLoading }: QueryInputProps) {
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>Write your SQL query</h2>
        <button 
          className={styles.executeButton} 
          onClick={onExecute} 
          disabled={isLoading}
        >
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
    </div>
  )
}