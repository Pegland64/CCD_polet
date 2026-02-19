import { describe, it, expect } from 'vitest';
import { Abonne } from '../src/models/Abonne';
import { Article } from '../src/models/Article';
import { Categorie, TrancheAge, Etat } from '../src/models/types';
import { validerComposition, peutAjouter } from '../src/core/validator';

// ── Helpers ──────────────────────────────────────────────────────────────────

function creerArticle(
    id: string,
    categorie: Categorie = 'SOC',
    age: TrancheAge = 'PE',
    etat: Etat = 'B',
    prix: number = 10,
    poids: number = 200,
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

// ── Tests : validerComposition ──────────────────────────────────────────────

describe('validerComposition', () => {

    // ── Cas valides ──────────────────────────────────────────────────────

    it('retourne valide pour une liste vide d\'abonnés', () => {
        const result = validerComposition([], 5000);
        expect(result.valide).toBe(true);
        expect(result.interdictions).toHaveLength(0);
    });

    it('retourne valide quand toutes les contraintes sont respectées', () => {
        const a1 = creerAbonne('s1', 'Alice', 'PE');
        const a2 = creerAbonne('s2', 'Bob', 'EN');

        a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'N', 10, 300));
        a1.box.ajouterArticle(creerArticle('a2', 'FIG', 'PE', 'B', 15, 400));
        a2.box.ajouterArticle(creerArticle('a3', 'CON', 'EN', 'TB', 20, 500));

        const result = validerComposition([a1, a2], 5000);
        expect(result.valide).toBe(true);
        expect(result.interdictions).toHaveLength(0);
    });

    it('retourne valide pour des abonnés avec des box vides', () => {
        const a1 = creerAbonne('s1', 'Alice');
        const a2 = creerAbonne('s2', 'Bob');

        const result = validerComposition([a1, a2], 5000);
        expect(result.valide).toBe(true);
        expect(result.interdictions).toHaveLength(0);
    });

    // ── Règle 1 : unicité des articles ───────────────────────────────────

    describe('Règle 1 – unicité des articles', () => {
        it('détecte un article dupliqué dans deux box différentes', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            const a2 = creerAbonne('s2', 'Bob', 'PE');

            const articleCommun = creerArticle('a1', 'SOC', 'PE');
            a1.box.ajouterArticle(articleCommun);
            a2.box.ajouterArticle(articleCommun);

            const result = validerComposition([a1, a2], 5000);
            expect(result.valide).toBe(false);
            expect(result.interdictions).toHaveLength(1);
            expect(result.interdictions[0]).toContain('Règle 1');
            expect(result.interdictions[0]).toContain('a1');
        });

        it('détecte plusieurs articles dupliqués', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            const a2 = creerAbonne('s2', 'Bob', 'PE');

            const art1 = creerArticle('a1', 'SOC', 'PE');
            const art2 = creerArticle('a2', 'FIG', 'PE');
            a1.box.ajouterArticle(art1);
            a1.box.ajouterArticle(art2);
            a2.box.ajouterArticle(art1);
            a2.box.ajouterArticle(art2);

            const result = validerComposition([a1, a2], 5000);
            expect(result.valide).toBe(false);
            const interdictionsRegle1 = result.interdictions.filter(i => i.includes('Règle 1'));
            expect(interdictionsRegle1).toHaveLength(2);
        });

        it('ne signale pas de doublon quand les articles sont différents', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            const a2 = creerAbonne('s2', 'Bob', 'PE');

            a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE'));
            a2.box.ajouterArticle(creerArticle('a2', 'SOC', 'PE'));

            const result = validerComposition([a1, a2], 5000);
            const interdictionsRegle1 = result.interdictions.filter(i => i.includes('Règle 1'));
            expect(interdictionsRegle1).toHaveLength(0);
        });
    });

    // ── Règle 2 : compatibilité d'âge ───────────────────────────────────

    describe('Règle 2 – compatibilité d\'âge', () => {
        it('détecte un article incompatible en âge', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            // Article pour "EN" dans la box d'un abonné "PE"
            a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'EN'));

            const result = validerComposition([a1], 5000);
            expect(result.valide).toBe(false);
            expect(result.interdictions).toHaveLength(1);
            expect(result.interdictions[0]).toContain('Règle 2');
            expect(result.interdictions[0]).toContain('Alice');
        });

        it('détecte plusieurs incompatibilités d\'âge', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'EN'));
            a1.box.ajouterArticle(creerArticle('a2', 'FIG', 'AD'));

            const result = validerComposition([a1], 5000);
            const interdictionsRegle2 = result.interdictions.filter(i => i.includes('Règle 2'));
            expect(interdictionsRegle2).toHaveLength(2);
        });

        it('ne signale rien quand l\'âge est compatible', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE'));

            const result = validerComposition([a1], 5000);
            const interdictionsRegle2 = result.interdictions.filter(i => i.includes('Règle 2'));
            expect(interdictionsRegle2).toHaveLength(0);
        });
    });

    // ── Règle 3 : poids maximum par box ─────────────────────────────────

    describe('Règle 3 – poids maximum par box', () => {
        it('détecte un dépassement de poids', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'B', 10, 3000));
            a1.box.ajouterArticle(creerArticle('a2', 'FIG', 'PE', 'B', 10, 3000));

            // poids total = 6000g > poidsMax 5000g
            const result = validerComposition([a1], 5000);
            expect(result.valide).toBe(false);
            expect(result.interdictions).toHaveLength(1);
            expect(result.interdictions[0]).toContain('Règle 3');
            expect(result.interdictions[0]).toContain('Alice');
            expect(result.interdictions[0]).toContain('6000');
        });

        it('accepte une box dont le poids est exactement au max', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'B', 10, 2500));
            a1.box.ajouterArticle(creerArticle('a2', 'FIG', 'PE', 'B', 10, 2500));

            // poids total = 5000g === poidsMax 5000g → OK
            const result = validerComposition([a1], 5000);
            const interdictionsRegle3 = result.interdictions.filter(i => i.includes('Règle 3'));
            expect(interdictionsRegle3).toHaveLength(0);
        });

        it('accepte une box dont le poids est sous le max', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'B', 10, 1000));

            const result = validerComposition([a1], 5000);
            const interdictionsRegle3 = result.interdictions.filter(i => i.includes('Règle 3'));
            expect(interdictionsRegle3).toHaveLength(0);
        });

        it('détecte le dépassement sur plusieurs abonnés', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            const a2 = creerAbonne('s2', 'Bob', 'PE');
            a1.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'B', 10, 6000));
            a2.box.ajouterArticle(creerArticle('a2', 'FIG', 'PE', 'B', 10, 6000));

            const result = validerComposition([a1, a2], 5000);
            const interdictionsRegle3 = result.interdictions.filter(i => i.includes('Règle 3'));
            expect(interdictionsRegle3).toHaveLength(2);
        });
    });

    // ── Combinaisons de règles ──────────────────────────────────────────

    describe('Combinaisons de règles', () => {
        it('détecte des violations simultanées de plusieurs règles', () => {
            const a1 = creerAbonne('s1', 'Alice', 'PE');
            const a2 = creerAbonne('s2', 'Bob', 'EN');

            // Article partagé (Règle 1) + mauvais âge pour Bob (Règle 2)
            const articleCommun = creerArticle('a1', 'SOC', 'PE', 'B', 10, 200);
            a1.box.ajouterArticle(articleCommun);
            a2.box.ajouterArticle(articleCommun); // doublon + âge PE ≠ EN

            // Article trop lourd pour Alice (Règle 3)
            a1.box.ajouterArticle(creerArticle('a2', 'FIG', 'PE', 'B', 10, 9000));

            const result = validerComposition([a1, a2], 5000);
            expect(result.valide).toBe(false);

            const r1 = result.interdictions.filter(i => i.includes('Règle 1'));
            const r2 = result.interdictions.filter(i => i.includes('Règle 2'));
            const r3 = result.interdictions.filter(i => i.includes('Règle 3'));

            expect(r1.length).toBeGreaterThanOrEqual(1);
            expect(r2.length).toBeGreaterThanOrEqual(1);
            expect(r3.length).toBeGreaterThanOrEqual(1);
        });
    });
});

// ── Tests : peutAjouter ─────────────────────────────────────────────────────

describe('peutAjouter', () => {
    it('retourne true quand l\'article est compatible en âge et en poids', () => {
        const abonne = creerAbonne('s1', 'Alice', 'PE');
        const article = creerArticle('a1', 'SOC', 'PE', 'B', 10, 200);
        expect(peutAjouter(abonne, article, 5000)).toBe(true);
    });

    it('retourne false quand l\'article a un âge incompatible', () => {
        const abonne = creerAbonne('s1', 'Alice', 'PE');
        const article = creerArticle('a1', 'SOC', 'EN', 'B', 10, 200);
        expect(peutAjouter(abonne, article, 5000)).toBe(false);
    });

    it('retourne false quand l\'article ferait dépasser le poids max', () => {
        const abonne = creerAbonne('s1', 'Alice', 'PE');
        abonne.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'B', 10, 4500));

        const article = creerArticle('a2', 'FIG', 'PE', 'B', 10, 1000);
        // 4500 + 1000 = 5500 > 5000
        expect(peutAjouter(abonne, article, 5000)).toBe(false);
    });

    it('retourne true quand le poids total atteint exactement le max', () => {
        const abonne = creerAbonne('s1', 'Alice', 'PE');
        abonne.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'B', 10, 4000));

        const article = creerArticle('a2', 'FIG', 'PE', 'B', 10, 1000);
        // 4000 + 1000 = 5000 === poidsMax
        expect(peutAjouter(abonne, article, 5000)).toBe(true);
    });

    it('retourne false quand les deux contraintes sont violées (âge + poids)', () => {
        const abonne = creerAbonne('s1', 'Alice', 'PE');
        abonne.box.ajouterArticle(creerArticle('a1', 'SOC', 'PE', 'B', 10, 4500));

        // Âge incompatible ET poids dépassé
        const article = creerArticle('a2', 'FIG', 'AD', 'B', 10, 1000);
        expect(peutAjouter(abonne, article, 5000)).toBe(false);
    });

    it('retourne true pour une box vide avec un article léger et compatible', () => {
        const abonne = creerAbonne('s1', 'Alice', 'BB');
        const article = creerArticle('a1', 'SOC', 'BB', 'N', 5, 100);
        expect(peutAjouter(abonne, article, 5000)).toBe(true);
    });
});

