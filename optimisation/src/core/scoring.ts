import { Abonne } from '../models/Abonne';
import { Article } from '../models/Article';
import { Etat } from '../models/types';

/**
 * Table de correspondance rang de préférence → points (Règle 4)
 * Index 0 = 1er rang (10 pts), Index 5 = 6ème rang (1 pt)
 */
const POINTS_PAR_RANG: number[] = [10, 8, 6, 4, 2, 1];

/**
 * Bonus par état (Règle 5)
 */
const BONUS_ETAT: Record<Etat, number> = { N: 2, TB: 1, B: 0 };

/**
 * Retourne les points de préférence d'un article pour un abonné (Règle 4 uniquement).
 */
export function getPointsPreference(abonne: Abonne, article: Article): number {
    const rang = abonne.preferences.indexOf(article.categorie);
    if (rang === -1) {
        return 1;
    }
    return POINTS_PAR_RANG[rang] ?? 1;
}

/**
 * Retourne le bonus d'état d'un article (Règle 5).
 */
export function getBonusEtat(article: Article): number {
    return BONUS_ETAT[article.etat] ?? 0;
}

/**
 * Retourne le score complet d'un article placé dans la box d'un abonné
 * = points de préférence (Règle 4) + bonus d'état (Règle 5).
 */
export function getScoreArticle(abonne: Abonne, article: Article): number {
    return getPointsPreference(abonne, article) + getBonusEtat(article);
}

/**
 * Calcule le score d'une box individuelle (Règles 4 + 5).
 */
export function calculerScoreBox(abonne: Abonne): number {
    let score = 0;
    for (const article of abonne.box.articles) {
        score += getScoreArticle(abonne, article);
    }
    return score;
}

/**
 * Calcule le malus d'équité (Règle 8 & Appliqué une seule fois par abonné concerné)
 */
export function calculerMalusEquite(abonnes: Abonne[]): number {
    if (abonnes.length === 0) return 0;

    const tailles = abonnes.map(ab => ab.box.articles.length);
    const minTaille = Math.min(...tailles);
    const maxTaille = Math.max(...tailles);

    // S'il n'y a pas d'écart ≥ 2 --> pas de malus
    if (maxTaille - minTaille < 2) return 0;

    // Chaque abonné dont la taille s'écarte de ≥ 2 par rapport à au moins un autre subit le malus
    let malus = 0;
    for (const taille of tailles) {
        if (maxTaille - taille >= 2 || taille - minTaille >= 2) {
            malus -= 10;
        }
    }
    return malus;
}

/**
 * Calcule le malus "tout le monde est servi" (Règle 7).
 * Chaque abonné avec une box vide → malus de -10.
 */
export function calculerMalusBoxVide(abonnes: Abonne[]): number {
    let malus = 0;
    for (const abonne of abonnes) {
        if (abonne.box.articles.length === 0) {
            malus -= 10;
        }
    }
    return malus;
}

/**
 * Calcule le score global d'une composition (Règles 4 + 5 + 7 + 8).
 */
export function calculerScoreTotal(abonnes: Abonne[]): number {
    let scoreTotal = 0;
    for (const abonne of abonnes) {
        scoreTotal += calculerScoreBox(abonne);
    }
    scoreTotal += calculerMalusBoxVide(abonnes);   // Règle 7
    scoreTotal += calculerMalusEquite(abonnes);     // Règle 8
    return scoreTotal;
}
