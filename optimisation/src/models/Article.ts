import { Categorie, TrancheAge, Etat } from './types';

export class Article {
    constructor(
        public readonly id: string,             // ex: "a1" [cite: 182]
        public readonly designation: string,    // ex: "Monopoly Junior" [cite: 183]
        public readonly categorie: Categorie,   // ex: "SOC" [cite: 184]
        public readonly age: TrancheAge,        // ex: "PE" [cite: 185]
        public readonly etat: Etat,             // ex: "N" [cite: 186]
        public readonly prix: number,           // en euros (entier) [cite: 187]
        public readonly poids: number           // en grammes (entier) [cite: 188]
    ) {}
}