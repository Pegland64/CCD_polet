import { Abonne } from "../models/Abonne";
import { Article } from "../models/Article";
import { peutAjouter } from "../core/validator";
import { calculerScoreTotal } from "../core/scoring";

export function binPacking(abonnes: Abonne[], articles: Article[], wmax: number): Abonne[] {
    const sortedArticles = [...articles].sort((a, b) => b.poids - a.poids);


    for (const art of sortedArticles) {

        let bestAbonne: Abonne | null = null;
        let bestGain = 0;

        for (const ab of abonnes) {

            if (!peutAjouter(ab, art, wmax)) continue;

            // Gain marginal réel
            const scoreAvant = calculerScoreTotal(abonnes);
            ab.box.ajouterArticle(art);
            const scoreApres = calculerScoreTotal(abonnes);
            ab.box.articles.pop();

            const gain = scoreApres - scoreAvant;

            if (gain > bestGain) {
                bestGain = gain;
                bestAbonne = ab;
            }
        }

        if (bestAbonne) {
            bestAbonne.box.ajouterArticle(art);
        }
    }

    return abonnes;
}
