import { Article } from "./Article";
import { Abonne } from "./Abonne";

export class Box {
    public articles: Article[] = [];

    constructor(public readonly proprietaire: Abonne) { }

    ajouterArticle(article: Article): void {
        this.articles.push(article);
    }

    getPoidsTotal(): number {
        return this.articles.reduce((total, article) => total + article.poids, 0);
    }

    peutAccueillir(article: Article, poidsMax: number): boolean {
        return (this.getPoidsTotal() + article.poids) <= poidsMax;
    }

    getPrixTotal(): number {
        return this.articles.reduce((total, article) => total + article.prix, 0);
    }
}