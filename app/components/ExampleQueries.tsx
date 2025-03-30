import { ExampleQuery } from "../types"
import styles from "@/app/editor/editor.module.css"

interface ExampleQueriesProps {
  examples: ExampleQuery[]
  onSelect: (query: string) => void
}

export default function ExampleQueries({ examples, onSelect }: ExampleQueriesProps) {
  return (
    <div className={styles.examplesSection}>
      <div className={styles.sectionHeader}>
        <h3>Example Queries</h3>
      </div>
      <div className={styles.examplesList}>
        {examples.map((example) => (
          <div 
            key={example.id} 
            className={styles.exampleItem}
            onClick={() => onSelect(example.query)}
          >
            <div className={styles.exampleTitle}>{example.name}</div>
            <div className={styles.exampleDescription}>{example.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}