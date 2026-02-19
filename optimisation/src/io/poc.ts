import { pool } from './poc_connection';

export async function poc(abonnes: any[], articles: any[], budgetMax: number) {
    let conn;
    try {
        console.log("Connecting to DB from POC...");
        conn = await pool.connect();
        console.log("Connected.");

        await conn.query(`
            CREATE TABLE IF NOT EXISTS articles (
                id_article INTEGER PRIMARY KEY,
                nom_article VARCHAR(255),
                categorie VARCHAR(50),
                tranche_age VARCHAR(50),
                etat VARCHAR(50),
                prix INTEGER,
                poids INTEGER
            )
        `);

        const resCount = await conn.query("SELECT count(*) as count FROM articles");
        const count = Number(resCount.rows[0].count);
        console.log(`Articles table exists. Row count: ${count}`);

        if (count === 0) {
            console.log("Inserting articles from CSV...");
            for (const art of articles) {
                const idStr = art.id.replace('a', '');
                const id = parseInt(idStr, 10);

                await conn.query(
                    "INSERT INTO articles (id_article, nom_article, categorie, tranche_age, etat, prix, poids) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                    [id, art.designation, art.categorie, art.age, art.etat, art.prix, art.poids]
                );
            }
            console.log("Articles inserted.");
        } else {
            console.log("Articles already in DB, skipping insertion.");
        }

        const resArticles = await conn.query("SELECT * FROM articles");
        console.log("Current articles in DB (first 5):", resArticles.rows.slice(0, 5));

    } catch (err) {
        console.error("POC Error:", err);
    } finally {
        if (conn) conn.release();
    }
}
