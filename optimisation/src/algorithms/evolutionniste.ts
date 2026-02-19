import { Abonne } from '../models/Abonne';
import { Article } from '../models/Article';
import { peutAjouter } from '../core/validator';
import { calculerScoreTotal } from '../core/scoring';

export interface EvolutionOptions {
    taillePopulation: number;
    nbGenerations: number;
    tauxMutation: number;
    tailleTournoi: number;
    elitisme: number;
}

type Chromosome = number[];
interface Individu { chromosome: Chromosome; score: number; }

function randInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/** Reconstruit les box des abonnés à partir d'un chromosome */
function decoder(chromosome: Chromosome, abonnesRef: Abonne[], articles: Article[], wmax: number): Abonne[] {
    const clones = abonnesRef.map(ab => new Abonne(ab.id, ab.prenom, ab.ageEnfant, ab.preferences));

    for (let i = 0; i < chromosome.length; i++) {
        const abIdx = chromosome[i];
        if (abIdx === -1) continue;
        if (peutAjouter(clones[abIdx], articles[i], wmax)) {
            clones[abIdx].box.ajouterArticle(articles[i]);
        }
    }
    return clones;
}

function evaluer(chromosome: Chromosome, abonnesRef: Abonne[], articles: Article[], wmax: number): number {
    return calculerScoreTotal(decoder(chromosome, abonnesRef, articles, wmax));
}

/** Crée un chromosome aléatoire valide */
function creerChromosomeAleatoire(abonnesRef: Abonne[], articles: Article[], wmax: number): Chromosome {
    const chromosome: Chromosome = new Array(articles.length).fill(-1);
    const poids = new Array(abonnesRef.length).fill(0);
    const indices = shuffle([...Array(articles.length).keys()]);

    for (const i of indices) {
        const art = articles[i];
        const candidats: number[] = [];
        for (let j = 0; j < abonnesRef.length; j++) {
            if (abonnesRef[j].ageEnfant === art.age && poids[j] + art.poids <= wmax)
                candidats.push(j);
        }
        if (candidats.length > 0) {
            const choix = candidats[randInt(candidats.length)];
            chromosome[i] = choix;
            poids[choix] += art.poids;
        }
    }
    return chromosome;
}

function selectionTournoi(population: Individu[], tailleTournoi: number): Individu {
    let meilleur: Individu | null = null;
    for (let i = 0; i < tailleTournoi; i++) {
        const candidat = population[randInt(population.length)];
        if (!meilleur || candidat.score > meilleur.score) meilleur = candidat;
    }
    return meilleur!;
}

/** Croisement à deux points */
function croiser(p1: Chromosome, p2: Chromosome): [Chromosome, Chromosome] {
    const n = p1.length;
    const e1: Chromosome = new Array(n);
    const e2: Chromosome = new Array(n);
    let pt1 = randInt(n), pt2 = randInt(n);
    if (pt1 > pt2) [pt1, pt2] = [pt2, pt1];

    for (let i = 0; i < n; i++) {
        const swap = i >= pt1 && i <= pt2;
        e1[i] = swap ? p2[i] : p1[i];
        e2[i] = swap ? p1[i] : p2[i];
    }
    return [e1, e2];
}

/** Mutation : réattribue aléatoirement certains gènes */
function muter(chromosome: Chromosome, abonnesRef: Abonne[], articles: Article[], wmax: number, tauxMutation: number): Chromosome {
    const mutant = [...chromosome];
    const poids = new Array(abonnesRef.length).fill(0);
    for (let i = 0; i < mutant.length; i++)
        if (mutant[i] !== -1) poids[mutant[i]] += articles[i].poids;

    for (let i = 0; i < mutant.length; i++) {
        if (Math.random() >= tauxMutation) continue;
        const art = articles[i];
        if (mutant[i] !== -1) poids[mutant[i]] -= art.poids;

        const candidats: number[] = [-1];
        for (let j = 0; j < abonnesRef.length; j++)
            if (abonnesRef[j].ageEnfant === art.age && poids[j] + art.poids <= wmax)
                candidats.push(j);

        const choix = candidats[randInt(candidats.length)];
        mutant[i] = choix;
        if (choix !== -1) poids[choix] += art.poids;
    }
    return mutant;
}

export function evolutionniste(abonnes: Abonne[], articles: Article[], wmax: number, options: EvolutionOptions): Abonne[] {
    const { taillePopulation, nbGenerations, tauxMutation, tailleTournoi, elitisme } = options;

    // 1. Population initiale
    let population: Individu[] = [];
    for (let i = 0; i < taillePopulation; i++) {
        const chromosome = creerChromosomeAleatoire(abonnes, articles, wmax);
        population.push({ chromosome, score: evaluer(chromosome, abonnes, articles, wmax) });
    }
    population.sort((a, b) => b.score - a.score);
    let meilleur = population[0];
    console.log(`  Gén 0 | Meilleur : ${meilleur.score}`);

    // 2. Boucle générationnelle
    for (let gen = 1; gen <= nbGenerations; gen++) {
        const nouvelle: Individu[] = population.slice(0, elitisme); // élitisme

        while (nouvelle.length < taillePopulation) {
            const p1 = selectionTournoi(population, tailleTournoi);
            const p2 = selectionTournoi(population, tailleTournoi);
            let [e1, e2] = croiser(p1.chromosome, p2.chromosome);
            e1 = muter(e1, abonnes, articles, wmax, tauxMutation);
            e2 = muter(e2, abonnes, articles, wmax, tauxMutation);

            nouvelle.push({ chromosome: e1, score: evaluer(e1, abonnes, articles, wmax) });
            if (nouvelle.length < taillePopulation)
                nouvelle.push({ chromosome: e2, score: evaluer(e2, abonnes, articles, wmax) });
        }

        population = nouvelle.sort((a, b) => b.score - a.score);
        if (population[0].score > meilleur.score) meilleur = population[0];

        if (gen % 100 === 0 || gen === nbGenerations)
            console.log(`  Gén ${gen} | Meilleur : ${population[0].score} | Global : ${meilleur.score}`);
    }

    // 3. Appliquer la meilleure solution
    console.log(`\nMeilleur score : ${meilleur.score}`);
    for (const ab of abonnes) ab.box.articles = [];
    for (let i = 0; i < meilleur.chromosome.length; i++) {
        const abIdx = meilleur.chromosome[i];
        if (abIdx === -1) continue;
        if (peutAjouter(abonnes[abIdx], articles[i], wmax))
            abonnes[abIdx].box.ajouterArticle(articles[i]);
    }

    return abonnes;
}
