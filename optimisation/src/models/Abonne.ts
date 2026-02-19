import {Article} from "./Article";
import {AGE_TRANCHES, Categorie, TrancheAge} from "./types";
import { Box } from './Box';

export class Abonne {
    public box: Box;
    constructor(
        public readonly id: string,             // ex: "s1"
        public readonly prenom: string,         // ex: "Alice"
        public readonly ageEnfant: TrancheAge,  // ex: "PE"
        public readonly preferences: Categorie[] // Liste ordonnée de la plus à la moins souhaitée
    ) {
        this.box = new Box(this);
    }

    /**
     * Retourne true si l'article est compatible (même tranche ou tranche adjacente).
     * Les tranches non adjacentes sont incompatibles.
     */
    estCompatible(article: Article): boolean {
        const idxAbonne = AGE_TRANCHES.indexOf(this.ageEnfant);
        const idxArticle = AGE_TRANCHES.indexOf(article.age);
        return Math.abs(idxAbonne - idxArticle) <= 1;
    }
}