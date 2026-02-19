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

const POLLING_INTERVAL_MS = 10000; // 10 secondes

async function runOptimizationCycle() {
    try {
        console.log('🔄 Vérification des campagnes et nouveaux inscrits...');

        // 1. Récupération de la campagne en cours
        const campagne = await getCampagneEnBrouillon();
        if (!campagne) {
            console.log('zzz Aucune campagne BROUILLON. En attente...');
            return;
        }
        const poidsMax = campagne.poidsMax || POIDS_MAX_DEFAUT;

        // 2. Récupération des articles DISPONIBLES
        const articles = await getArticles();
        if (articles.length === 0) {
            console.log('zzz Aucun article disponible. En attente...');
            return;
        }

        // 3. Récupération des abonnés SANS box pour cette campagne
        // (Note: getAbonnes() retourne tous les abonnés. Idéalement il faudrait filtrer ceux qui ont déjà une box dans cette campagne)
        // Pour l'instant, on récupère tout, mais on pourrait optimiser la requête SQL.
        // Simplification: On refait le calcul pour tout le monde ou on filtre ?
        // LE MIEUX : Modifier getAbonnes pour ne prendre que ceux qui n'ont PAS de box dans la campagne actuelle.

        // Pour ce POC : on récupère tous les abonnés.
        // MAIS ATTENTION : saveBoxesToDB va créer des doublons si on ne vérifie pas.
        // IL FAUT filtrer les abonnés déjà traités.

        const client = await pool.connect();
        let abonnesSansBox: Abonne[] = [];
        try {
            // Récupérer les ID des utilisateurs qui ont déjà une box dans cette campagne
            const resDejaTraites = await client.query(
                'SELECT "utilisateurId" FROM boxes WHERE "campagneId" = $1',
                [campagne.id]
            );
            const dejaTraites = new Set(resDejaTraites.rows.map((r: any) => r.utilisateurId));

            const tousAbonnes = await getAbonnes();
            abonnesSansBox = tousAbonnes.filter(a => !dejaTraites.has(a.id));

        } finally {
            client.release();
        }

        if (abonnesSansBox.length === 0) {
            console.log('zzz Tous les abonnés de la campagne ont déjà une box. En attente de nouveaux inscrits...');
            return;
        }

        console.log(`🚀 ${abonnesSansBox.length} nouveau(x) abonné(s) à traiter pour la campagne ${campagne.nom}...`);

        // 4. Algorithme glouton
        glouton(abonnesSansBox, articles, poidsMax);

        // 5. Enregistrement
        await saveBoxesToDB(abonnesSansBox, campagne.id, pool);

        // 6. Affichage (optionnel)
        afficherBoxes(abonnesSansBox);

    } catch (err) {
        console.error('❌ Erreur dans le cycle d\'optimisation:', err);
    }
}

// Lancement du polling
console.log(`🚀 Service d'optimisation démarré (Polling tous les ${POLLING_INTERVAL_MS / 1000}s)`);
setInterval(runOptimizationCycle, POLLING_INTERVAL_MS);
runOptimizationCycle(); // Premier lancement immédiat
