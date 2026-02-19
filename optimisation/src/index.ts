import { getAbonnes, getArticles, getCampagneEnBrouillon, pool } from './io/poc_connection';
import { glouton } from './algorithms/glouton';
import { calculerScoreBox } from './core/scoring';
import { saveBoxesToDB } from './io/dbWriter';
import { Abonne } from './models/Abonne';

// ─── Paramètres ────────────────────────────────────────────────────────────
const POIDS_MAX_DEFAUT = 2000; // utilisé si la campagne ne définit pas de poidsMax

/**
 * Affiche dans la console le contenu de chaque box composée.
 */
function afficherBoxes(abonnes: Abonne[]): void {
    console.log('\n════════════════════════════════════════════════');
    console.log('  RÉSULTAT DES BOXES');
    console.log('════════════════════════════════════════════════');

    let scoreTotal = 0;

    for (const abonne of abonnes) {
        const box = abonne.box;
        const score = calculerScoreBox(abonne);
        scoreTotal += score;

        if (box.articles.length === 0) {
            console.log(`\n📦 ${abonne.prenom.padEnd(15)} — box vide`);
            continue;
        }

        console.log(
            `\n📦 ${abonne.prenom.padEnd(15)} | score: ${score} | ` +
            `poids: ${box.getPoidsTotal()}g | prix: ${box.getPrixTotal()}€ | ` +
            `${box.articles.length} article(s)`
        );

        for (const art of box.articles) {
            console.log(
                `     • [${art.id}] ${art.designation.padEnd(25)} ` +
                `${art.categorie} | ${art.age} | ${art.etat} | ${art.prix}€ | ${art.poids}g`
            );
        }
    }

    console.log('\n════════════════════════════════════════════════');
    console.log(`  SCORE TOTAL : ${scoreTotal}`);
    console.log('════════════════════════════════════════════════\n');
}

async function main() {
    try {
        console.log('🔌 Connexion à PostgreSQL...');

        // 1. Récupération de la campagne en cours
        const campagne = await getCampagneEnBrouillon();
        if (!campagne) {
            console.error('❌ Aucune campagne en statut BROUILLON trouvée en base.');
            process.exit(1);
        }
        const poidsMax = campagne.poidsMax || POIDS_MAX_DEFAUT;
        console.log(`✅ Campagne trouvée : ${campagne.id} | poidsMax: ${poidsMax}g`);

        // 2. Récupération des données
        const [abonnes, articles] = await Promise.all([getAbonnes(), getArticles()]);
        console.log(`✅ ${abonnes.length} abonné(s) | ${articles.length} article(s) récupéré(s)`);

        // 3. Algorithme glouton
        console.log('\n⚙️  Exécution de l\'algorithme glouton...');
        glouton(abonnes, articles, poidsMax);
        console.log('✅ Optimisation terminée.');

        // 4. Affichage des boxes
        afficherBoxes(abonnes);

        // 5. Enregistrement en base de données
        console.log('💾 Enregistrement des boxes en base de données...');
        await saveBoxesToDB(abonnes, campagne.id, pool);
        console.log('✅ Enregistrement terminé.');

    } catch (err) {
        console.error('❌ Erreur fatale:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
