import { describe, it, expect } from 'vitest';
import { Abonne } from '../src/models/Abonne';
import { Article } from '../src/models/Article';
import { Categorie, TrancheAge, Etat } from '../src/models/types';
import {
    getPointsPreference,
    getBonusEtat,
    getScoreArticle,
    calculerScoreBox,
    calculerMalusEquite,
    calculerMalusBoxVide,
    calculerScoreTotal,
} from '../src/core/scoring';

// ── Helpers ──────────────────────────────────────────────────────────────────

function creerArticle(
    id: string,
    categorie: Categorie,
    age: TrancheAge = 'PE',
    etat: Etat = 'B',
    poids: number = 200,
    prix: number = 10,
): Article {
    return new Article(id, `Article ${id}`, categorie, age, etat, prix, poids);
}

function creerAbonne(
    id: string,
    prenom: string,
    age: TrancheAge = 'PE',
    preferences: Categorie[] = ['SOC', 'FIG', 'CON', 'EXT', 'EVL', 'LIV'],
): Abonne {
    return new Abonne(id, prenom, age, preferences);
}

// ── Tests : getPointsPreference ─────────────────────────────────────────────

describe('getPointsPreference', () => {
    const abonne = creerAbonne('s1', 'Alice');

    it('renvoie 10 points pour la catégorie préférée (rang 1)', () => {
        const article = creerArticle('a1', 'SOC');
        expect(getPointsPreference(abonne, article)).toBe(10);
    });

    it('renvoie 8 points pour le rang 2', () => {
        const article = creerArticle('a2', 'FIG');
        expect(getPointsPreference(abonne, article)).toBe(8);
    });

    it('renvoie 6 points pour le rang 3', () => {
        const article = creerArticle('a3', 'CON');
        expect(getPointsPreference(abonne, article)).toBe(6);
    });

    it('renvoie 4 points pour le rang 4', () => {
        const article = creerArticle('a4', 'EXT');
        expect(getPointsPreference(abonne, article)).toBe(4);
    });

    it('renvoie 2 points pour le rang 5', () => {
        const article = creerArticle('a5', 'EVL');
        expect(getPointsPreference(abonne, article)).toBe(2);
    });

    it('renvoie 1 point pour le rang 6', () => {
        const article = creerArticle('a6', 'LIV');
        expect(getPointsPreference(abonne, article)).toBe(1);
    });

    it('renvoie 1 point si la catégorie est absente des préférences', () => {
        const abonneSansLIV = creerAbonne('s2', 'Bob', 'PE', ['SOC', 'FIG', 'CON', 'EXT', 'EVL']);
        const article = creerArticle('a7', 'LIV');
        expect(getPointsPreference(abonneSansLIV, article)).toBe(1);
    });
});

// ── Tests : getBonusEtat ────────────────────────────────────────────────────

describe('getBonusEtat', () => {
    it('renvoie +2 pour un article neuf (N)', () => {
        const article = creerArticle('a1', 'SOC', 'PE', 'N');
        expect(getBonusEtat(article)).toBe(2);
    });

    it('renvoie +1 pour un article en très bon état (TB)', () => {
        const article = creerArticle('a2', 'SOC', 'PE', 'TB');
        expect(getBonusEtat(article)).toBe(1);
    });

    it('renvoie 0 pour un article en bon état (B)', () => {
        const article = creerArticle('a3', 'SOC', 'PE', 'B');
        expect(getBonusEtat(article)).toBe(0);
    });
});

// ── Tests : getScoreArticle ─────────────────────────────────────────────────

describe('getScoreArticle', () => {
    const abonne = creerAbonne('s1', 'Alice');

    it('calcule le score sans dégressivité (premier article de la catégorie)', () => {
        const article = creerArticle('a1', 'SOC', 'PE', 'N');
        // rang 0 → 10 pts + bonus N → 2 = 12
        expect(getScoreArticle(abonne, article, 0)).toBe(12);
    });

    it('applique la dégressivité pour le 2e article de même catégorie', () => {
        const article = creerArticle('a2', 'SOC', 'PE', 'B');
        // rang effectif 0+1=1 → 8 pts + bonus B → 0 = 8
        expect(getScoreArticle(abonne, article, 1)).toBe(8);
    });

    it('applique la dégressivité pour le 3e article de même catégorie', () => {
        const article = creerArticle('a3', 'SOC', 'PE', 'TB');
        // rang effectif 0+2=2 → 6 pts + bonus TB → 1 = 7
        expect(getScoreArticle(abonne, article, 2)).toBe(7);
    });

    it('retombe à 1 point quand le rang effectif dépasse la table', () => {
        const article = creerArticle('a4', 'SOC', 'PE', 'B');
        // rang effectif 0+6=6 → hors table → 1 pt + 0 = 1
        expect(getScoreArticle(abonne, article, 6)).toBe(1);
    });
});

// ── Tests : calculerScoreBox ────────────────────────────────────────────────

describe('calculerScoreBox', () => {
    it('renvoie 0 pour une box vide', () => {
        const abonne = creerAbonne('s1', 'Alice');
        expect(calculerScoreBox(abonne)).toBe(0);
    });

    it('calcule le score pour une box avec un seul article', () => {
        const abonne = creerAbonne('s1', 'Alice');
        abonne.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'N'));
        // 10 + 2 = 12
        expect(calculerScoreBox(abonne)).toBe(12);
    });

    it('applique la dégressivité pour articles de même catégorie', () => {
        const abonne = creerAbonne('s1', 'Alice');
        abonne.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'B')); // rang 0 → 10 + 0
        abonne.box.ajouterArticle(creerArticle('a2', 'SOC', 'PE', 'B')); // rang 1 → 8 + 0
        expect(calculerScoreBox(abonne)).toBe(18);
    });

    it('calcule correctement avec des catégories variées', () => {
        const abonne = creerAbonne('s1', 'Alice');
        abonne.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'N'));  // 10 + 2 = 12
        abonne.box.ajouterArticle(creerArticle('a2', 'FIG', 'PE', 'TB')); // 8 + 1 = 9
        abonne.box.ajouterArticle(creerArticle('a3', 'CON', 'PE', 'B'));  // 6 + 0 = 6
        expect(calculerScoreBox(abonne)).toBe(27);
    });
});

// ── Tests : calculerMalusEquite ─────────────────────────────────────────────

describe('calculerMalusEquite', () => {
    it('renvoie 0 si la liste est vide', () => {
        expect(calculerMalusEquite([])).toBe(0);
    });

    it('renvoie 0 si tous les abonnés ont le même nombre d\'articles', () => {
        const a1 = creerAbonne('s1', 'Alice');
        const a2 = creerAbonne('s2', 'Bob');
        a1.box.ajouterArticle(creerArticle('a1', 'SOC'));
        a2.box.ajouterArticle(creerArticle('a2', 'FIG'));
        expect(calculerMalusEquite([a1, a2])).toBe(0);
    });

    it('renvoie 0 si l\'écart est inférieur à 2', () => {
        const a1 = creerAbonne('s1', 'Alice');
        const a2 = creerAbonne('s2', 'Bob');
        a1.box.ajouterArticle(creerArticle('a1', 'SOC'));
        a1.box.ajouterArticle(creerArticle('a2', 'FIG'));
        a2.box.ajouterArticle(creerArticle('a3', 'CON'));
        // écart = 1 → pas de malus
        expect(calculerMalusEquite([a1, a2])).toBe(0);
    });

    it('applique un malus de -10 par abonné concerné si écart >= 2', () => {
        const a1 = creerAbonne('s1', 'Alice');
        const a2 = creerAbonne('s2', 'Bob');
        a1.box.ajouterArticle(creerArticle('a1', 'SOC'));
        a1.box.ajouterArticle(creerArticle('a2', 'FIG'));
        a1.box.ajouterArticle(creerArticle('a3', 'CON'));
        // a2 a 0 articles, a1 a 3 → écart 3 ≥ 2 → les deux sont concernés
        expect(calculerMalusEquite([a1, a2])).toBe(-20);
    });
});

// ── Tests : calculerMalusBoxVide ────────────────────────────────────────────

describe('calculerMalusBoxVide', () => {
    it('renvoie 0 si tous les abonnés ont au moins un article', () => {
        const a1 = creerAbonne('s1', 'Alice');
        a1.box.ajouterArticle(creerArticle('a1', 'SOC'));
        expect(calculerMalusBoxVide([a1])).toBe(0);
    });

    it('renvoie -10 par abonné avec une box vide', () => {
        const a1 = creerAbonne('s1', 'Alice');
        const a2 = creerAbonne('s2', 'Bob');
        a1.box.ajouterArticle(creerArticle('a1', 'SOC'));
        // a2 a une box vide
        expect(calculerMalusBoxVide([a1, a2])).toBe(-10);
    });

    it('renvoie -20 si deux abonnés ont des box vides', () => {
        const a1 = creerAbonne('s1', 'Alice');
        const a2 = creerAbonne('s2', 'Bob');
        expect(calculerMalusBoxVide([a1, a2])).toBe(-20);
    });
});

// ── Tests : calculerScoreTotal ──────────────────────────────────────────────

describe('calculerScoreTotal', () => {
    it('renvoie 0 pour une liste vide', () => {
        expect(calculerScoreTotal([])).toBe(0);
    });

    it('cumule scores, malus box vide et malus équité', () => {
        const a1 = creerAbonne('s1', 'Alice');
        const a2 = creerAbonne('s2', 'Bob');

        // Alice : 3 articles
        a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'N'));  // 10+2 = 12
        a1.box.ajouterArticle(creerArticle('a2', 'FIG', 'PE', 'B')); // 8+0  = 8
        a1.box.ajouterArticle(creerArticle('a3', 'CON', 'PE', 'B')); // 6+0  = 6

        // Bob : box vide → malus box vide -10
        // Écart articles : 3 vs 0 → malus équité -10 * 2 = -20

        const scoreBoxAlice = 12 + 8 + 6; // 26
        const malusBoxVide = -10;          // Bob
        const malusEquite = -20;           // les deux concernés

        expect(calculerScoreTotal([a1, a2])).toBe(scoreBoxAlice + malusBoxVide + malusEquite);
    });

    it('pas de malus quand tout est équilibré', () => {
        const a1 = creerAbonne('s1', 'Alice');
        const a2 = creerAbonne('s2', 'Bob');

        a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'B')); // 10+0 = 10
        a2.box.ajouterArticle(creerArticle('a2', 'SOC', 'PE', 'B')); // 10+0 = 10

        // Pas de malus
        expect(calculerScoreTotal([a1, a2])).toBe(20);
    });
});

