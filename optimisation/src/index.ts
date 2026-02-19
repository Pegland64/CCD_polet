import { parseCSV } from './io/csvParser';
import { poc } from './io/poc';
import { glouton } from './algorithms/glouton';
import { calculerScoreTotal, calculerScoreBox } from './core/scoring';
import { writeCSV } from './io/csvWriter';

const POIDS_MAX = 1000;

const { articles, abonnes, budgetMax } = parseCSV('../input_csv/01_exemple/exemple.csv');

console.log('=== DONNÉES CHARGÉES ===');
console.log(`${articles.length} articles | ${abonnes.length} abonnés | Budget max : ${budgetMax}€\n`);

const result = glouton(abonnes, articles, POIDS_MAX);

console.log('=== RÉSULTATS GLOUTON ===');
for (const abonne of result) {
    const box = abonne.box;

    console.log(`\n📦 Box de ${abonne.prenom} (${abonne.ageEnfant})`);
    console.log(`   Préférences : ${abonne.preferences.join(', ')}`);
    console.log(`   Articles    :`);
    for (const article of box.articles) {
        console.log(`     - [${article.id}] ${article.designation} | ${article.categorie} | ${article.prix}€ | ${article.poids}g`);
    }
    console.log(`   Poids total : ${box.getPoidsTotal()}g / ${POIDS_MAX}g`);
    console.log(`   Prix total  : ${box.getPrixTotal()}€`);
    console.log(`   Score box   : ${calculerScoreBox(abonne)} pts`);
}

console.log(`\n=== SCORE GLOBAL : ${calculerScoreTotal(result)} pts ===`);

console.log('\n=== APPEL POC ===');
// Appel io/poc.ts pour tester le code
poc(abonnes, articles, budgetMax);


// Écriture du CSV de sortie
writeCSV(result, '../output_csv/01_exemple/resultat.csv');