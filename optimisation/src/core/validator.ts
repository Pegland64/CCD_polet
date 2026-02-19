import { Abonne } from '../models/Abonne';
import { Article } from '../models/Article';
import { AGE_TRANCHES } from "../models/types";

/**
 * Résultat de la validation d'une composition.
 * Contient un booléen global et la liste des interdictions détectées.
 */
export interface ValidationResult {
    valide: boolean;
    interdictions: string[];
}

/**
 * Vérifie toutes les contraintes d'une composition de box.
 *
 * Contraintes vérifiées :
 *  - Règle 1 : unicité des articles (un article dans une seule box au plus)
 *  - Règle 2 : compatibilité d'âge (tranche d'âge article === tranche d'âge enfant)
 *  - Règle 3 : poids max par box
 */
export function validerComposition(abonnes: Abonne[], poidsMax: number): ValidationResult {
    const interdictions: string[] = [];

    // --- Règle 1 : unicité des articles ---
    const articlesVus = new Set<string>();
    for (const abonne of abonnes) {
        for (const article of abonne.box.articles) {
            if (articlesVus.has(article.id)) {
                interdictions.push(
                    `Règle 1 (unicité) : l'article ${article.id} ("${article.designation}") apparaît dans plusieurs box.`
                );
            }
            articlesVus.add(article.id);
        }
    }

    // --- Règle 2 : compatibilité d'âge (tranches non adjacentes interdites) ---
    for (const abonne of abonnes) {
        for (const article of abonne.box.articles) {
            const idxAbonne = AGE_TRANCHES.indexOf(abonne.ageEnfant);
            const idxArticle = AGE_TRANCHES.indexOf(article.age);
            if (Math.abs(idxAbonne - idxArticle) > 1) {
                interdictions.push(
                    `Règle 2 (âge) : l'article ${article.id} (${article.age}) est incompatible avec l'abonné ${abonne.prenom} (${abonne.ageEnfant}) — tranches non adjacentes.`
                );
            }
        }
    }

    // --- Règle 3 : poids maximum par box ---
    for (const abonne of abonnes) {
        const poidsTotal = abonne.box.getPoidsTotal();
        if (poidsTotal > poidsMax) {
            interdictions.push(
                `Règle 3 (poids) : la box de ${abonne.prenom} pèse ${poidsTotal}g, dépasse le max de ${poidsMax}g.`
            );
        }
    }

    return {
        valide: interdictions.length === 0,
        interdictions
    };
}

/**
 * Vérifie si un article peut être ajouté à la box d'un abonné
 * en respectant les contraintes de base (âge + poids).
 */
export function peutAjouter(abonne: Abonne, article: Article, poidsMax: number): boolean {
    // Compatibilité d'âge
    if (!abonne.estCompatible(article)) {
        return false;
    }
    // Contrainte de poids
    if (!abonne.box.peutAccueillir(article, poidsMax)) {
        return false;
    }
    return true;
}


