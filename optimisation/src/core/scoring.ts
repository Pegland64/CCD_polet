import { Abonne } from '../models/Abonne';
import { Article } from '../models/Article';

/**
 * Table de correspondance rang de préférence → points (Règle 4)
 * Index 0 = 1er rang (10 pts), Index 5 = 6ème rang (1 pt)
 */
const POINTS_PAR_RANG: number[] = [10, 8, 6, 4, 2, 1];

/**
 * Retourne les points de préférence d'un article pour un abonné donné suivant son ordre de préference (Règle 4)
 */
export function getPointsPreference(abonne: Abonne, article: Article): number {
    const rang = abonne.preferences.indexOf(article.categorie);
    if (rang === -1) {
        // Catégorie non trouvée dans les préférences (ne devrait pas arriver)
        return 1;
    }
    return POINTS_PAR_RANG[rang] ?? 1;
}

/**
 * Calcule le score d'une box individuelle
 */
export function calculerScoreBox(abonne: Abonne): number {
    let score = 0;
    for (const article of abonne.box.articles) {
        score += getPointsPreference(abonne, article);
    }
    return score;
}

/**
 * Calcule le score global d'une composition (somme des scores de toutes les box)
 */
export function calculerScoreTotal(abonnes: Abonne[]): number {
    let scoreTotal = 0;
    for (const abonne of abonnes) {
        scoreTotal += calculerScoreBox(abonne);
    }
    return scoreTotal;
}
