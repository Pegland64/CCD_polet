import { getAbonnes, getArticles, pool } from './io/poc_connection';

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
        console.error("Erreur fatale:", err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
