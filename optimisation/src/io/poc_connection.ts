import { createPool } from "mariadb";
import fs from "fs";
import { fileURLToPath } from "url";
import { Article } from "../models/Article";
import { Abonne } from "../models/Abonne";
import { Categorie, TrancheAge, Etat } from "../models/types";

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

export async function getAbonnes(): Promise<Abonne[]> {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT id, prenom, tranche_age_enfant, preferences_categories FROM utilisateur WHERE role = 'abonne'"
        );
        return rows.map((row: any) => {
            const prefs: Categorie[] = row.preferences_categories
                ? (row.preferences_categories as string).split(',').map(s => s.trim() as Categorie)
                : [];
            return new Abonne(
                row.id,
                row.prenom,
                row.tranche_age_enfant as TrancheAge,
                prefs
            );
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des abonnés:", err);
        return [];
    } finally {
        if (conn) conn.release();
    }
}

export async function getArticles(): Promise<Article[]> {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT id, designation, categorie, trancheAge, etat, prix, poids FROM articles WHERE statut = 'DISPONIBLE'"
        );
        return rows.map((row: any) => new Article(
            row.id,
            row.designation,
            row.categorie as Categorie,
            row.trancheAge as TrancheAge,
            row.etat as Etat,
            Number(row.prix),
            Number(row.poids),
        ));
    } catch (err) {
        console.error("Erreur lors de la récupération des articles:", err);
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

        const articles = await getArticles();
        console.log("Articles récupérés:", articles);

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
