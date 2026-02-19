import { AlgorithmStrategy, AlgorithmName } from "../models/AlgorithmStrategy";
import { glouton } from "./glouton";
import { binPacking } from "./binPacking";
import { recuit } from "./recuit";
import { evolutionniste, EvolutionOptions } from "./evolutionniste";

const gloutonStrategy: AlgorithmStrategy = {
    name: "Glouton",
    run: (abonnes, articles, wmax) => glouton(abonnes, articles, wmax),
};

const binPackingStrategy: AlgorithmStrategy = {
    name: "Bin Packing",
    run: (abonnes, articles, wmax) => binPacking(abonnes, articles, wmax),
};

const recuitStrategy: AlgorithmStrategy = {
    name: "Recuit Simulé",
    run: (abonnes, articles, wmax) => recuit(abonnes, articles, wmax),
};

const defaultEvolutionOptions: EvolutionOptions = {
    taillePopulation: 100,
    nbGenerations: 500,
    tauxMutation: 0.05,
    tailleTournoi: 5,
    elitisme: 2,
};

const evolutionnisteStrategy: AlgorithmStrategy = {
    name: "Évolutionniste",
    run: (abonnes, articles, wmax, options?: unknown) => {
        const opts = (options as EvolutionOptions) ?? defaultEvolutionOptions;
        return evolutionniste(abonnes, articles, wmax, opts);
    },
};

const algorithms = new Map<AlgorithmName, AlgorithmStrategy>([
    ["glouton", gloutonStrategy],
    ["binPacking", binPackingStrategy],
    ["recuit", recuitStrategy],
    ["evolutionniste", evolutionnisteStrategy],
]);

/**
 * Récupère un algorithme par son nom.
 * @throws Error si le nom n'est pas reconnu.
 */
export function getAlgorithm(name: AlgorithmName): AlgorithmStrategy {
    const algo = algorithms.get(name);
    if (!algo) {
        const available = listAlgorithms().join(", ");
        throw new Error(`Algorithme inconnu : "${name}". Disponibles : ${available}`);
    }
    return algo;
}

/** Retourne la liste des noms d'algorithmes disponibles. */
export function listAlgorithms(): AlgorithmName[] {
    return [...algorithms.keys()];
}
