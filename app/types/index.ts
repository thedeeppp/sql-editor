export interface QueryHistoryItem {
    id: string
    query: string
    timestamp: Date
    executionTime?: number
    rowCount?: number
  }
  
  export interface ExampleQuery {
    id: number
    name: string
    description: string
    query: string
  }
  
  export interface QueryResult {
    columns: string[]
    rows: any[][]
    executionTime: number
  }