import { pool } from './poc_connection';

export async function poc(abonnes: any[], articles: any[], budgetMax: number) {
    let conn;
    try {
        console.log("Connecting to DB from POC...");
        conn = await pool.getConnection();
        console.log("Connected.");

        // Check if articles table exists and has data
        // MariaDB connector returns BigInt for count(*) by default configuration sometimes, check rows[0].count
        const rows = await conn.query("SELECT count(*) as count FROM articles");
        const count = Number(rows[0].count);
        console.log(`Articles table exists. Row count: ${count}`);

        // Insert articles from CSV if table is empty
        if (count === 0) {
            console.log("Inserting articles from CSV...");
            for (const art of articles) {
                // Remove 'a' from id or parse it. Assuming 'a1' -> 1
                // art.id looks like 'a1'
                const idStr = art.id.replace('a', '');
                const id = parseInt(idStr, 10);

                await conn.query(
                    "INSERT INTO articles (id_article, nom_article, categorie, tranche_age, etat, prix, poids) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [id, art.designation, art.categorie, art.age, art.etat, art.prix, art.poids]
                );
            }
            console.log("Articles inserted.");
        } else {
            console.log("Articles already in DB, skipping insertion.");
        }

        const newRows = await conn.query("SELECT * FROM articles");
        console.log("Current articles in DB (first 5):", newRows.slice(0, 5));

    } catch (err) {
        console.error("POC Error:", err);
    } finally {
        if (conn) conn.release();
        // Don't close pool if other parts of app need it
    }
}
