import { createPool } from "mariadb";
import fs from "fs";

// Helper function to read secrets
const readSecret = (secretPath: string, defaultValue: string): string => {
    try {
        return fs.readFileSync(secretPath, 'utf8').trim();
    } catch (err) {
        console.warn(`Could not read secret from ${secretPath}, using default/env value.`);
        return process.env[secretPath] || defaultValue;
    }
};

const DB_HOST = process.env.DB_HOST || "mariadb";
// Reading from Docker secrets inside /run/secrets/
const DB_USER = readSecret("/run/secrets/db_user", "app_user");
const DB_PASSWORD = readSecret("/run/secrets/db_password", "password");
const DB_NAME = readSecret("/run/secrets/db_name", "crazy_charly_db");

const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectionLimit: 5,
});

async function main() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Connected to the database!");

        // Example: SELECT *
        // Assuming there is a table created by initialization scripts.
        // If running for the first time without init scripts, this might fail or return nothing if table doesn't exist.
        // We will just select current time or a system table to prove connection if specific table isn't guaranteed.
        // But user asked for SELECT * so I will query a hypothetical 'users' or 'test' table if it exists,
        // or just 'SELECT 1' for safety if no init script is provided yet.
        // However, user said "je mettrai le bon db.init", so let's try a generic SELECT or check tables.

        // Let's create a table if not exists for the POC
        await conn.query(`
      CREATE TABLE IF NOT EXISTS poc_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Insert example data
        await conn.query("INSERT INTO poc_table (name) VALUES (?)", ["test_entry"]);

        // SELECT *
        const rows = await conn.query("SELECT * FROM poc_table");
        console.log("Rows from poc_table:", rows);

        // DELETE Example
        const deleteResult = await conn.query("DELETE FROM poc_table WHERE name = ?", ["test_entry"]);
        console.log("Deleted rows:", deleteResult.affectedRows);

    } catch (err) {
        console.error("Error connecting or querying:", err);
    } finally {
        if (conn) conn.release(); // release to pool
        await pool.end();
    }
}

if (require.main === module) {
    main();
}

export { pool };
