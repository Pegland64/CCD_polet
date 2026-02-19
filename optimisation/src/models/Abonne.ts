import {Article} from "./Article";
import {Categorie, TrancheAge} from "./types";
import { Box } from './Box';

class Abonne {
    public box: Box;
    constructor(
        public readonly id: string,             // ex: "s1" [cite: 192]
        public readonly prenom: string,         // ex: "Alice" [cite: 193]
        public readonly ageEnfant: TrancheAge,  // ex: "PE" [cite: 194]
        public readonly preferences: Categorie[] // Liste ordonnée de la plus à la moins souhaitée [cite: 195]
    ) {
        this.box = new Box(this);
    }

    estCompatible(article: Article): boolean {
        return this.ageEnfant === article.age;
    }
}