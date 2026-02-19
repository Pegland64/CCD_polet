import { parseCSV } from './io/csvParser';

const { articles, abonnes, budgetMax } = parseCSV('../input_csv/01_exemple/exemple.csv');

console.log('=== ARTICLES ===');
for (const article of articles) {
    console.log(`[${article.id}] ${article.designation} | ${article.categorie} | ${article.age} | ${article.etat} | ${article.prix}€ | ${article.poids}g`);
}

console.log('\n=== ABONNÉS ===');
for (const abonne of abonnes) {
    console.log(`[${abonne.id}] ${abonne.prenom} | ${abonne.ageEnfant} | Préfs: ${abonne.preferences.join(', ')}`);
}

console.log('\n=== PARAMÈTRES ===');
console.log(`Budget max : ${budgetMax}€`);
