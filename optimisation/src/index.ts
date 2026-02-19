import { pool } from './io/poc_connection';
import { glouton } from './algorithms/glouton';
import { calculerScoreTotal, calculerScoreBox } from './core/scoring';
import { Article } from './models/Article';
import { Abonne } from './models/Abonne';
import { Categorie, TrancheAge, Etat } from './models/types';

// URL de l'API web pour envoyer les résultats
const API_URL = process.env.API_URL || 'http://crazy-charly-web:3000/api/boxes';

// Fonction principale asynchrone pour gérer la connexion BD et l'API
async function main() {
    let client;
    try {
        console.log('=== DÉMARRAGE DU TRAITEMENT ===');

        // 1. Connexion à la BD
        client = await pool.connect();
        console.log('Connecté à la base de données via Pool PG.');

        // 2. Récupérer la campagne en statut BROUILLON
        const resCampagne = await client.query("SELECT * FROM campagnes WHERE statut = 'BROUILLON' ORDER BY \"createdAt\" DESC LIMIT 1");
        if (resCampagne.rows.length === 0) {
            console.log('Aucune campagne en statut BROUILLON trouvée. Arrêt du traitement.');
            return;
        }
        const campagne = resCampagne.rows[0];
        console.log(`Campagne trouvée : ${campagne.nom} (ID: ${campagne.id}, Poids Max: ${campagne.poidsMax}g)`);

        // 3. Récupérer les articles DISPONIBLES
        const resArticles = await client.query(
            "SELECT * FROM articles WHERE statut = 'DISPONIBLE'"
        );
        const articles = resArticles.rows.map((row: any) => new Article(
            row.id,
            row.designation,
            row.categorie as Categorie,
            row.trancheAge as TrancheAge,
            row.etat as Etat,
            row.prix,
            row.poids
        ));
        console.log(`${articles.length} articles disponibles récupérés.`);

        if (articles.length === 0) {
            console.log('Aucun article disponible. Arrêt.');
            return;
        }

        // 4. Récupérer les utilisateurs (abonnés)
        // On ne prend que ceux qui ont des préférences définies ?
        // Pour l'instant, on prend tous les utilisateurs avec le rôle 'abonne' (par défaut)
        // La structure de la table est 'utilisateur' avec 'role' enum
        const resUsers = await client.query(
            "SELECT * FROM utilisateur WHERE role = 'abonne'"
        );

        const abonnes = resUsers.rows.map((row: any) => {
            // preferencesCategories est une chaine "CAT1,CAT2"
            const prefs = row.preferencesCategories
                ? row.preferencesCategories.split(',').map((p: string) => p.trim() as Categorie)
                : [];

            return new Abonne(
                row.id,
                row.prenom || 'Sans Nom',
                (row.trancheAgeEnfant as TrancheAge) || 'PE', // Valeur par défaut si null
                prefs
            );
        });
        console.log(`${abonnes.length} abonnés récupérés.`);

        if (abonnes.length === 0) {
            console.log('Aucun abonné trouvé. Arrêt.');
            return;
        }

        // 5. Lancer l'algorithme Glouton
        console.log('Lancement de l\'algorithme glouton...');
        const result = glouton(abonnes, articles, campagne.poidsMax);

        const scoreTotal = calculerScoreTotal(result);
        console.log(`=== RÉSULTATS GLOUTON ===`);
        console.log(`Score Global : ${scoreTotal} pts`);
        console.log(`${result.length} box générées.`);

        // 6. Préparer le payload pour l'API
        const boxesPayload = result.map(abonne => {
            const box = abonne.box;
            return {
                utilisateurId: abonne.id,
                articleIds: box.articles.map(a => a.id),
                score: calculerScoreBox(abonne),
                prixTotal: box.getPrixTotal(),
                poidsTotal: box.getPoidsTotal()
            };
        });

        // 7. Envoyer les résultats à l'API
        if (boxesPayload.length > 0) {
            console.log(`Envoi de ${boxesPayload.length} box à l'API ${API_URL}...`);

            const apiResponse = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    campagneId: campagne.id,
                    boxes: boxesPayload
                })
            });

            if (apiResponse.ok) {
                const json = await apiResponse.json();
                console.log('Succès de l\'envoi API:', json);
            } else {
                const errText = await apiResponse.text();
                console.error('Erreur lors de l\'envoi API:', apiResponse.status, errText);
            }
        } else {
            console.log('Aucune box à envoyer.');
        }

    } catch (err) {
        console.error("Erreur critique dans le script d'optimisation:", err);
    } finally {
        if (client) client.release();
        await pool.end(); // Fermer le pool à la fin du script
    }
}

// Exécuter la fonction principale
main();