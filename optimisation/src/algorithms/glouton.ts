import {Article} from "../models/Article";
import {Abonne} from "../models/Abonne";
import {peutAjouter} from "../core/validator";
import {getPointsPreference} from "../core/scoring";

export function glouton(abonnes: Abonne[], articles: Article[], wmax: number): Abonne[] {
    const remaining = [...articles]; // Copie de la liste des articles
    while(true){
        let bestMove: { abIndex: number, artIndex: number, gain: number } | null = null;

        for (let i = 0; i < remaining.length; i++) {
            const art = remaining[i];
            for (let j = 0; j < abonnes.length; j++) {
                const ab = abonnes[j];

                //ici mettre les vérifications
                if (!peutAjouter(ab, art, wmax)) continue;
                //ici mettre le gain
                const gain = getPointsPreference(ab, art);

                if(!bestMove || gain > bestMove.gain){
                    bestMove = { abIndex: j, artIndex: i, gain };
                }
            }

        }

        if (!bestMove || bestMove.gain <= 0) break; // Aucun mouvement rentable, on arrête

        // On effectue le meilleur mouvement trouvé
        const ab = abonnes[bestMove.abIndex];
        const art = remaining[bestMove.artIndex];
        ab.box.ajouterArticle(art);
        remaining.splice(bestMove.artIndex, 1); // Retire l'article de la liste des restants
    }
    return abonnes;
}
