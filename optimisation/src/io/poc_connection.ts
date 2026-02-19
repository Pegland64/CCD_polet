import { createPool } from "mariadb";
import fs from "fs";
import { fileURLToPath } from "url";

const readSecret = (secretPath: string, defaultValue: string): string => {
    try {
        return fs.readFileSync(secretPath, 'utf8').trim();
    } catch (err) {
        console.warn(`Could not read secret from ${secretPath}, using default/env value.`);
        return process.env[secretPath] || defaultValue;
    }
};

const DB_HOST = process.env.DB_HOST || "mariadb";
const DB_USER = readSecret("/run/secrets/db_user", "app_user");
const DB_PASSWORD = readSecret("/run/secrets/db_password", "password");
const DB_NAME = readSecret("/run/secrets/db_name", "crazy_charly_db");

export const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectionLimit: 5,
});

export interface Abonne {
    id: string;
    nom: string;
    prenom: string;
    age: number;
    budget: number;
}

export async function getAbonnes(): Promise<Abonne[]> {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM abonnes");
        return rows.map((row: any) => ({
            id: `s${row.id_abonne}`,
            nom: row.nom,
            prenom: row.prenom,
            age: Number(row.age),
            budget: Number(row.budget),
        }));
    } catch (err) {
        console.error("Erreur lors de la récupération des abonnés:", err);
        return [];
    } finally {
        if (conn) conn.release();
    }
}

async function main() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Connected to the database!");

        const abonnes = await getAbonnes();
        console.log("Abonnés récupérés:", abonnes);

    } catch (err) {
        console.error("Error connecting or querying:", err);
    } finally {
        if (conn) conn.release();
        await pool.end();
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}
