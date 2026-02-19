import { Categorie, TrancheAge, Etat } from './types';

export class Article {
    constructor(
        public readonly id: string,             // ex: "a1"
        public readonly designation: string,    // ex: "Monopoly Junior"
        public readonly categorie: Categorie,   // ex: "SOC"
        public readonly age: TrancheAge,        // ex: "PE"
        public readonly etat: Etat,             // ex: "N"
        public readonly prix: number,           // en euros (entier)
        public readonly poids: number           // en grammes (entier)
    ) {}
}