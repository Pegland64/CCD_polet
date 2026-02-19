import { parseCSV } from './io/csvParser';
import { glouton } from "./algorithms/glouton";
import { calculerScoreTotal } from "./core/scoring";
import { binPacking } from "./algorithms/binPacking";
import { Abonne } from "./models/Abonne";
import { Article } from "./models/Article";
import { recuit } from "./algorithms/recuit";
import { writeCSV } from "./io/csvWriter";

const { articles, abonnes, budgetMax } = parseCSV('../../input_csv/03_pb_complexes/pb7.csv');

console.log('=== ARTICLES ===');
for (const article of articles) {
    console.log(`[${article.id}] ${article.designation} | ${article.categorie} | ${article.age} | ${article.etat} | ${article.prix}€ | ${article.poids}g`);
}

console.log('\n=== ABONNÉS ===');
for (const abonne of abonnes) {
    console.log(`[${abonne.id}] ${abonne.prenom} | ${abonne.ageEnfant} | Préfs: ${abonne.preferences.join(', ')}`);
}

console.log('\n=== PARAMÈTRES ===');
console.log(`Poid max : ${budgetMax}g`);



function resetBoxes(abonnes: Abonne[]) {
    for (const ab of abonnes) {
        ab.box.articles = [];
    }
}

function indexById<T extends { id: string }>(arr: T[]): Map<string, T> {
    return new Map(arr.map(x => [x.id, x]));
}

/**
 * Applique une solution sous forme:
 * { "Lea": ["a2","a1"], "Noah": ["a9","a10"], ... }
 */
function appliquerSolution(
    abonnes: Abonne[],
    articles: Article[],
    solution: Record<string, string[]>
) {
    const abByPrenom = new Map(abonnes.map(a => [a.prenom, a]));
    const artById = indexById(articles);

    for (const [prenom, artIds] of Object.entries(solution)) {
        const ab = abByPrenom.get(prenom);
        if (!ab) throw new Error(`Abonné introuvable: "${prenom}"`);

        for (const id of artIds) {
            const art = artById.get(id);
            if (!art) throw new Error(`Article introuvable: "${id}"`);
            ab.box.ajouterArticle(art);
        }
    }
}
function afficherSolution(abonnes: any[], score: number) {
    console.log("\n===== RESULTAT GLOUTON =====");
    console.log("Score total:", score);
    console.log("-----------------------------");

    for (const ab of abonnes) {
        console.log(`\nBox de ${ab.prenom} :`);
        if (ab.box.articles.length === 0) {
            console.log("  (vide)");
        }

        for (const a of ab.box.articles) {
            console.log(
                `  - ${a.id} | ${a.designation} | ${a.categorie} | ${a.age} | ${a.etat} | ${a.poids}g`
            );
        }

        console.log(
            `  -> Total poids: ${ab.box.getPoidsTotal()}g`
        );
    }

    console.log("=============================\n");
}

const solution = recuit(abonnes, articles, budgetMax);

//glouton(abonnes, articles, budgetMax);
//binPacking(abonnes, articles, budgetMax);
//afficherSolution(abonnes, calculerScoreTotal(abonnes));
const score = calculerScoreTotal(solution);

afficherSolution(solution, score);
