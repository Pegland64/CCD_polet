import {Article} from "../models/Article";
import {Abonne} from "../models/Abonne";
import {Box} from "../models/Box";

export function glouton(abonnes: Abonne[], articles: Article[], wmax: number): Abonne[] {
    const remaining = [...articles]; // Copie de la liste des articles
    while(true){
        let bestMove: { abIndex: number, artIndex: number, gain: number } | null = null;

        for (let i = 0; i < remaining.length; i++) {
            const art = remaining[i];
            for (let j = 0; j < abonnes.length; j++) {
                const ab = abonnes[j];

                //ici mettre les vérifications

                //ici mettre le gain

                if(!bestMove || gain > bestMove.gain){
                    bestMove = { abIndex: j, artIndex: i, gain };
                }
            }

        }
        if(!bestMove) break;// Aucun mouvement possible, on arrête

        // On effectue le meilleur mouvement trouvé
        const ab = abonnes[bestMove.abIndex];
        const art = remaining[bestMove.artIndex];
        ab.box.ajouterArticle(art);
        remaining.splice(bestMove.artIndex, 1); // Retire l'article de la liste des restants
    }
    return abonnes;
}