import { QueryHistoryItem } from "../types"

export const loadQueryHistory = (): QueryHistoryItem[] => {
  if (typeof window === "undefined") return []
  
  const savedHistory = localStorage.getItem("queryHistory")
  if (savedHistory) {
    try {
      const parsedHistory = JSON.parse(savedHistory)
      // Convert string timestamps back to Date objects
      return parsedHistory.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }))
    } catch (e) {
      console.error("Failed to parse query history:", e)
      return []
    }
  }
  return []
}

export const saveQueryHistory = (history: QueryHistoryItem[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("queryHistory", JSON.stringify(history))
}

export const clearQueryHistory = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("queryHistory")
}