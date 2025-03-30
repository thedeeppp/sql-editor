import { ExampleQuery } from "../types"

export const exampleQueries: ExampleQuery[] = [
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
    query: "SELECT COUNT(*) FROM products;"
  },
  {
    id: 4,
    name: "Order table (long version)",
    description: "Show all orders from order table",
    query: "SELECT * FROM orders;"
  }
]