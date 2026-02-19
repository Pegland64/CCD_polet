import { Pool } from 'pg';
import { Abonne } from '../models/Abonne';
import { Article } from '../models/Article';
import { Categorie, TrancheAge, Etat } from '../models/types';
import { calculerScoreBox, calculerScoreTotal } from '../core/scoring';
import { getAbonnes } from './poc_connection';

/**
 * Insère les boxes et leurs articles dans la base de données.
 *
 * Pour chaque abonné :
 *  - Crée une entrée dans la table `boxes` avec le score, poidsTotal, prixTotal,
 *    l'id de la campagne et l'id de l'utilisateur (abonné).
 *  - Met à jour chaque article de la box en lui assignant le `boxId` créé
 *    et en passant son statut à 'EN_ATTENTE'.
 *
 * @param abonnes   Liste des abonnés avec leurs boxes composées.
 * @param campagneId  UUID de la campagne en cours.
 * @param pool      Pool de connexion PostgreSQL.
 */
export async function saveBoxesToDB(
    abonnes: Abonne[],
    campagneId: string,
    pool: Pool
): Promise<void> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const abonne of abonnes) {
            const box = abonne.box;

            const score = calculerScoreBox(abonne);
            const poidsTotal = box.getPoidsTotal();
            const prixTotal = box.getPrixTotal();

            // 1. Insérer la box
            const resBox = await client.query<{ id: string }>(
                `INSERT INTO boxes (id, score, "poidsTotal", "prixTotal", "campagneId", "utilisateurId", "createdAt")
                 VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())
                 RETURNING id`,
                [score, poidsTotal, prixTotal, campagneId, abonne.id]
            );

            const boxId = resBox.rows[0].id;

            // 2. Mettre à jour chaque article : lui affecter la box et passer en EN_ATTENTE
            for (const article of box.articles) {
                await client.query(
                    `UPDATE articles
                     SET "boxId" = $1, statut = 'EN_ATTENTE', "updatedAt" = NOW()
                     WHERE id = $2`,
                    [boxId, article.id]
                );
            }

            console.log(
                `Box créée pour ${abonne.prenom} (id: ${boxId}) | ` +
                `score: ${score} | poids: ${poidsTotal}g | prix: ${prixTotal}€ | ` +
                `${box.articles.length} article(s)`
            );
        }

        await client.query('COMMIT');
        console.log('Toutes les boxes ont été enregistrées en base.');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erreur lors de l\'enregistrement des boxes, rollback effectué :', err);
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Finalise une campagne : calcule le score global et passe le statut à 'COMPOSEE'.
 */
export async function finalizeCampaignInDB(
    campagneId: string,
    pool: Pool
): Promise<void> {
    const client = await pool.connect();
    try {
        console.log(`[FINALIZE] Calcul du score global pour la campagne ${campagneId}...`);

        // 1. Récupérer TOUS les abonnés
        const abonnes = await getAbonnes();

        // 2. Reconstituer les boxes pour chaque abonné dans cette campagne
        for (const abonne of abonnes) {
            const resArticles = await client.query(
                `SELECT a.id, a.designation, a.categorie, a."trancheAge", a.etat, a.prix, a.poids
                 FROM articles a
                 JOIN boxes b ON a."boxId" = b.id
                 WHERE b."campagneId" = $1 AND b."utilisateurId" = $2`,
                [campagneId, abonne.id]
            );

            for (const row of resArticles.rows) {
                abonne.box.ajouterArticle(new Article(
                    row.id,
                    row.designation,
                    row.categorie as Categorie,
                    row["trancheAge"] as TrancheAge,
                    row.etat as Etat,
                    Number(row.prix),
                    Number(row.poids)
                ));
            }
        }

        // 3. Calculer le score global (avec malus)
        const totalScore = calculerScoreTotal(abonnes);

        // 4. Mettre à jour la campagne
        await client.query(
            `UPDATE campagnes
             SET statut = 'COMPOSEE', "totalScore" = $1, "updatedAt" = NOW()
             WHERE id = $2`,
            [totalScore, campagneId]
        );

        console.log(`Campagne ${campagneId} finalisée. Status: COMPOSEE, Score: ${totalScore}`);

    } catch (err) {
        console.error('Erreur lors de la finalisation de la campagne :', err);
        throw err;
    } finally {
        client.release();
    }
}

