import Link from "next/link"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Northwind SQL Editor</h1>
        <p>Write SQL queries against the Northwind dataset</p>
      </header>

      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            This application allows you to write and execute SQL queries against the Northwind dataset. The dataset
            includes information about products, orders, customers, employees, and more.
          </p>
          <Link href="/editor" className={styles.button}>
            Go to SQL Editor
          </Link>
        </div>

        <div className={styles.tables}>
          <h2>Available Tables</h2>
          <ul>
            <li>categories</li>
            <li>customers</li>
            <li>employees</li>
            <li>orders</li>
            <li>order_details</li>
            <li>products</li>
            <li>regions</li>
            <li>shippers</li>
            <li>suppliers</li>
            <li>territories</li>
          </ul>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Data source:{" "}
          <a
            href="https://github.com/graphql-compose/graphql-compose-examples/tree/master/examples/northwind/data/csv"
            target="_blank"
            rel="noopener noreferrer"
          >
            Northwind Dataset (CSV)
          </a>
        </p>
      </footer>
    </div>
  )
}

