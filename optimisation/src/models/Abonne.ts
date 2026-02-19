import {Article} from "./Article";
import {Categorie, TrancheAge} from "./types";
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

    estCompatible(article: Article): boolean {
        return this.ageEnfant === article.age;
    }
}