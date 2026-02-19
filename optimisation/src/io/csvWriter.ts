import * as fs from 'node:fs';
import * as path from 'node:path';
import { Abonne } from '../models/Abonne';
import { calculerScoreTotal } from '../core/scoring';

export function writeCSV(abonnes: Abonne[], outputPath: string): void {
    const lignes: string[] = [];

    const scoreTotal = calculerScoreTotal(abonnes);
    lignes.push(scoreTotal.toString());

    for (const abonne of abonnes) {
        for (const article of abonne.box.articles) {
            lignes.push(`${abonne.prenom};${article.id};${article.categorie};${article.age};${article.etat}`);
        }
    }

    const contenu = lignes.join('\n');
    const resolvedPath = path.resolve(outputPath);

    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(resolvedPath, contenu, 'utf-8');
    console.log(`Résultat écrit dans : ${resolvedPath}`);
}
