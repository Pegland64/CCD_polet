import {Abonne} from "../models/Abonne";
import {Article} from "../models/Article";
import {peutAjouter} from "../core/validator";
import {calculerScoreTotal} from "../core/scoring";
import {glouton} from "./glouton";

function cloneSolution(abonnes: Abonne[]): Abonne[] {
    return abonnes.map(ab => {
        const clone = new Abonne(ab.id, ab.prenom, ab.ageEnfant, [...ab.preferences]);
        clone.box.articles = [...ab.box.articles];
        return clone;
    });
}

function genererVoisin(abonnes: Abonne[], wmax: number):void  {
    if(abonnes.length < 2)return;
    const sourceIndex = Math.floor(Math.random() * abonnes.length);
    const source = abonnes[sourceIndex];

    if(source.box.articles.length === 0) return;

    const articleIndex = Math.floor(Math.random() * source.box.articles.length);
    const article = source.box.articles[articleIndex];

    const destinationIndex = Math.floor(Math.random() * abonnes.length);
    if (destinationIndex === sourceIndex) return;

    const destination = abonnes[destinationIndex];

    if(!peutAjouter(destination,article,wmax))return;

    source.box.articles.splice(articleIndex, 1);
    destination.box.ajouterArticle(article);

}

export function recuit(abonnes: Abonne[], articles: Article[], wmax: number): Abonne[] {
    const init = cloneSolution(abonnes);
    glouton(init, articles, wmax);

    let solution = cloneSolution(init);
    let bestSolution = cloneSolution(init);

    let temperature = 100;
    const coolingRate = 0.995;

    while(temperature > 0.1) {
        for (let i = 0; i < 1000; i++) {
            const candidate = cloneSolution(solution);
            genererVoisin(candidate, wmax);

            const scoreCur = calculerScoreTotal(solution);
            const scoreCand = calculerScoreTotal(candidate);
            const delta = scoreCand - scoreCur;

            // acceptation
            if (delta >= 0 || Math.random() < Math.exp(delta / temperature)) {
                solution = candidate;
            }

            // meilleur
            if (calculerScoreTotal(solution) > calculerScoreTotal(bestSolution)) {
                bestSolution = cloneSolution(solution);
            }
        }

        temperature *= coolingRate;
    }

    return bestSolution;
}