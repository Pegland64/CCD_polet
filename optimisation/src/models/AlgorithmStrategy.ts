import { Abonne } from "./Abonne";
import { Article } from "./Article";

/**
 * Interface commune pour tous les algorithmes d'optimisation (Patron Stratégie).
 *
 * Chaque algorithme implémente cette interface afin de pouvoir
 * être interchangé dynamiquement par le point d'entrée.
 */
export interface AlgorithmStrategy {
    /** Nom lisible de l'algorithme */
    readonly name: string;

    /**
     * Exécute l'algorithme d'optimisation.
     *
     * @param abonnes  Liste des abonnés à remplir
     * @param articles Liste des articles disponibles
     * @param wmax     Poids maximum par box (en grammes)
     * @param options  Options spécifiques à l'algorithme (optionnel)
     * @returns        La liste des abonnés avec leurs box remplies
     */
    run(abonnes: Abonne[], articles: Article[], wmax: number, options?: unknown): Abonne[];
}

/** Noms des algorithmes disponibles */
export type AlgorithmName = 'glouton' | 'binPacking' | 'recuit' | 'evolutionniste';
