import { parseCSV } from './io/csvParser';
import { calculerScoreTotal } from "./core/scoring";
import { AlgorithmName } from "./models/AlgorithmStrategy";
import { getAlgorithm, listAlgorithms } from "./algorithms/registry";

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
console.log(`Algorithmes disponibles : ${listAlgorithms().join(', ')}`);

const algoName = (process.argv[2] as AlgorithmName) || 'evolutionniste';
const algo = getAlgorithm(algoName);

console.log(`\n=== EXÉCUTION : ${algo.name} ===`);

const solution = algo.run(abonnes, articles, budgetMax);
const score = calculerScoreTotal(solution);

console.log(`\n===== RESULTAT ${algo.name.toUpperCase()} =====`);
console.log("Score total:", score);
console.log("-----------------------------");

for (const ab of solution) {
    console.log(`\nBox de ${ab.prenom} :`);
    if (ab.box.articles.length === 0) {
        console.log("  (vide)");
    }
    for (const a of ab.box.articles) {
        console.log(`  - ${a.id} | ${a.designation} | ${a.categorie} | ${a.age} | ${a.etat} | ${a.poids}g`);
    }
    console.log(`  -> Total poids: ${ab.box.getPoidsTotal()}g`);
}

console.log("=============================\n");
