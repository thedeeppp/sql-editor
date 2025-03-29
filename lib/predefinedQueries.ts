export interface QueryData {
    columns: string[]
    rows: any[][]
  }
  
  export interface PredefinedQuery {
    id: number
    name: string
    query: string
    data: QueryData
  }
  
  export const predefinedQueries: PredefinedQuery[] = [
    {
      id: 1,
      name: "Products List",
      query: "SELECT * FROM products LIMIT 10;",
      data: {
        columns: ["product_id", "product_name", "category_id", "unit_price", "units_in_stock"],
        rows: [
          [1, "Chai", 1, 18.0, 39],
          [2, "Chang", 1, 19.0, 17],
          [3, "Aniseed Syrup", 2, 10.0, 13],
          [4, "Chef Anton's Cajun Seasoning", 2, 22.0, 53],
          [5, "Chef Anton's Gumbo Mix", 2, 21.35, 0],
          [6, "Grandma's Boysenberry Spread", 2, 25.0, 120],
          [7, "Uncle Bob's Organic Dried Pears", 7, 30.0, 15],
          [8, "Northwoods Cranberry Sauce", 2, 40.0, 6],
          [9, "Mishi Kobe Niku", 6, 97.0, 29],
          [10, "Ikura", 8, 31.0, 31],
        ],
      },
    },
    {
      id: 2,
      name: "Products by Category",
      query:
        "SELECT c.category_name, COUNT(p.product_id) as product_count\nFROM categories c\nJOIN products p ON c.category_id = p.category_id\nGROUP BY c.category_name\nORDER BY product_count DESC;",
      data: {
        columns: ["category_name", "product_count"],
        rows: [
          ["Beverages", 12],
          ["Condiments", 12],
          ["Confections", 13],
          ["Dairy Products", 10],
          ["Grains/Cereals", 7],
          ["Meat/Poultry", 6],
          ["Produce", 5],
          ["Seafood", 12],
        ],
      },
    },
    {
      id: 3,
      name: "Top Customers",
      query:
        "SELECT c.company_name, COUNT(o.order_id) as order_count\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.company_name\nORDER BY order_count DESC\nLIMIT 5;",
      data: {
        columns: ["company_name", "order_count"],
        rows: [
          ["Ernst Handel", 10],
          ["QUICK-Stop", 7],
          ["Save-a-lot Markets", 5],
          ["Folk och fä HB", 5],
          ["Rattlesnake Canyon Grocery", 5],
        ],
      },
    },
    {
      id: 4,
      name: "Sales by Country",
      query:
        "SELECT ship_country, COUNT(order_id) as orders, SUM(freight) as total_freight\nFROM orders\nGROUP BY ship_country\nORDER BY orders DESC\nLIMIT 8;",
      data: {
        columns: ["ship_country", "orders", "total_freight"],
        rows: [
          ["USA", 122, 9658.4],
          ["Germany", 71, 4512.3],
          ["Brazil", 62, 3425.7],
          ["France", 58, 3756.2],
          ["UK", 56, 2896.8],
          ["Italy", 41, 2458.1],
          ["Spain", 32, 1861.5],
          ["Canada", 30, 1883.4],
        ],
      },
    },
    {
      id: 5,
      name: "Employee Performance",
      query:
        "SELECT e.first_name || ' ' || e.last_name as employee_name, \nCOUNT(o.order_id) as orders_processed, \nROUND(AVG(o.freight), 2) as avg_freight\nFROM employees e\nJOIN orders o ON e.employee_id = o.employee_id\nGROUP BY e.employee_id\nORDER BY orders_processed DESC;",
      data: {
        columns: ["employee_name", "orders_processed", "avg_freight"],
        rows: [
          ["Margaret Peacock", 156, 32.54],
          ["Janet Leverling", 127, 30.12],
          ["Nancy Davolio", 123, 28.71],
          ["Andrew Fuller", 96, 25.33],
          ["Robert King", 72, 26.88],
          ["Laura Callahan", 67, 31.45],
          ["Michael Suyama", 56, 24.78],
          ["Anne Dodsworth", 43, 27.92],
          ["Steven Buchanan", 42, 29.46],
        ],
      },
    },
  ]
  
  