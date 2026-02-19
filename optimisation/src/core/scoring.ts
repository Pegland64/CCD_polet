import { Abonne } from '../models/Abonne';
import { Article } from '../models/Article';
import { Categorie, Etat, TrancheAge } from '../models/types';

/**
 * Table de correspondance rang de préférence → points (Règle 4)
 * Index 0 = 1er rang (10 pts), Index 5 = 6ème rang (1 pt)
 */
const POINTS_PAR_RANG: number[] = [10, 8, 6, 4, 2, 1];

/**
 * Bonus par état (Règle 5)
 */
const BONUS_ETAT: Record<Etat, number> = { N: 2, TB: 1, B: 0 };

const AGE_TRANCHES: TrancheAge[] = ["BB", "PE", "EN", "AD"];

/**
 * Retourne le facteur de pénalité d'âge entre un article et un abonné.
 * - même tranche → 1 (score normal)
 * - tranche adjacente → 0.5 (score réduit de moitié, min 1)
 * - non adjacent → null (incompatible)
 */
function getAgePenaltyFactor(articleAge: TrancheAge, abonneAge: TrancheAge): number | null {
    const idxArticle = AGE_TRANCHES.indexOf(articleAge);
    const idxAbonne = AGE_TRANCHES.indexOf(abonneAge);

    if (idxArticle === -1 || idxAbonne === -1) return null;

    const diff = Math.abs(idxArticle - idxAbonne);

    if (diff === 0) return 1;    // même tranche → score normal
    if (diff === 1) return 0.5;  // tranche adjacente → score réduit de moitié
    return null;                 // non adjacent → incompatible
}

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
 * Retourne le score d'un article avec dégressivité (Règles 4 + 5 + 6 + compatibilité âge élargie).
 * @param dejaMemeCategorie Nombre d'articles de la même catégorie déjà dans la box (0 = premier)
 * Retourne null si l'article est incompatible avec l'abonné (tranches non adjacentes).
 */
export function getScoreArticle(abonne: Abonne, article: Article, dejaMemeCategorie: number = 0): number | null {
    const factor = getAgePenaltyFactor(article.age, abonne.ageEnfant);
    if (factor === null) return null; // incompatible

    const rang = abonne.preferences.indexOf(article.categorie);
    const rangEffectif = rang === -1 ? 6 : rang + dejaMemeCategorie; // décalage Règle 6
    const pointsPref = POINTS_PAR_RANG[rangEffectif] ?? 1;
    const bonusEtat = getBonusEtat(article);

    const pointsPrefAjustes = Math.max(1, Math.ceil(pointsPref * factor));
    return pointsPrefAjustes + bonusEtat;
}

/**
 * Calcule le score d'une box individuelle (Règles 4 + 5 + 6 + compatibilité âge élargie).
 */
export function calculerScoreBox(abonne: Abonne): number {
    let score = 0;
    const countCat: Partial<Record<Categorie, number>> = {};

    for (const article of abonne.box.articles) {
        const n = countCat[article.categorie] ?? 0;
        const s = getScoreArticle(abonne, article, n);
        if (s !== null) score += s;  // articles incompatibles (ne devraient pas être là) ignorés
        countCat[article.categorie] = n + 1;
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
 * Calcule le score global d'une composition (Règles 4 + 5 + 6 + 7 + 8).
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


