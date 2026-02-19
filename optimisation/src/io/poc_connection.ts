import { Pool } from "pg";
import fs from "fs";
import { fileURLToPath } from "url";
import { Abonne } from "../models/Abonne.js";
import { Article } from "../models/Article.js";
import { Categorie, TrancheAge, Etat } from "../models/types.js";

const readSecret = (secretPath: string, defaultValue: string): string => {
    try {
        return fs.readFileSync(secretPath, 'utf8').trim();
    } catch {
        return defaultValue;
    }
};

const DB_HOST = process.env.DB_HOST || "db";
const DB_USER = readSecret("/run/secrets/db_user", "app_user");
const DB_PASSWORD = readSecret("/run/secrets/db_password", "password");
const DB_NAME = readSecret("/run/secrets/db_name", "crazy_charly_db");

export const pool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    max: 5,
});

/**
 * Récupère les abonnés depuis la table `utilisateur` et les retourne en objets Abonne.
 * Les préférences sont stockées sous forme de chaîne séparée par des virgules (ex: "SOC,FIG,LIV").
 */
export async function getAbonnes(): Promise<Abonne[]> {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT id, prenom, tranche_age_enfant, preferences_categories
             FROM utilisateur
             WHERE role = 'abonne'`
        );
        return res.rows.map((row: any) => {
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
    } finally {
        client.release();
    }
}

export async function getArticles(): Promise<Article[]> {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT id, designation, categorie, "trancheAge", etat, prix, poids
             FROM articles
             WHERE (statut = 'DISPONIBLE' OR statut = 'EN_ATTENTE')
             AND "boxId" IS NULL`
        );
        return res.rows.map((row: any) => new Article(
            row.id,
            row.designation,
            row.categorie as Categorie,
            row["trancheAge"] as TrancheAge,
            row.etat as Etat,
            Number(row.prix),
            Number(row.poids),
        ));
    } finally {
        client.release();
    }
}

export async function getCampagneEnBrouillon(): Promise<{ id: string, nom: string, poidsMax: number } | null> {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT id, nom, "poidsMax"
             FROM campagnes
             WHERE statut = 'BROUILLON'
             ORDER BY "createdAt" DESC
             LIMIT 1`
        );
        if (res.rows.length === 0) return null;
        return {
            id: res.rows[0].id,
            nom: res.rows[0].nom,
            poidsMax: Number(res.rows[0].poidsMax),
        };
    } finally {
        client.release();
    }
}


async function main() {
    try {
        console.log("Connexion à PostgreSQL...");

        const abonnes = await getAbonnes();
        console.log(`\n=== ${abonnes.length} abonné(s) récupéré(s) ===`);
        for (const ab of abonnes) {
            console.log(`  [${ab.id}] ${ab.prenom} | âge: ${ab.ageEnfant} | prefs: ${ab.preferences.join(', ')}`);
        }

        const articles = await getArticles();
        console.log(`\n=== ${articles.length} article(s) récupéré(s) ===`);
        for (const art of articles) {
            console.log(`  [${art.id}] ${art.designation} | ${art.categorie} | ${art.age} | ${art.etat} | ${art.prix}€ | ${art.poids}g`);
        }

    } catch (err) {
        console.error("Erreur:", err);
    } finally {
        await pool.end();
    }
}

const isMain = process.argv[1]?.endsWith('poc_connection.ts') || process.argv[1]?.endsWith('poc_connection.js');
if (isMain) {
    main();
}
