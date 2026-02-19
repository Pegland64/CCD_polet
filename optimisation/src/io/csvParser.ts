import * as fs from 'node:fs';
import * as path from 'node:path';
import { Article } from '../models/Article';
import { Abonne } from '../models/Abonne';
import { Categorie, TrancheAge, Etat } from '../models/types';

export interface ParsedCSV {
    articles: Article[];
    abonnes: Abonne[];
    budgetMax: number;
}

export function parseCSV(filePath: string): ParsedCSV {
    const contenu = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const lignes = contenu.split('\n').map((l: string) => l.trim()).filter((l: string) => l !== '');

    const articles: Article[] = [];
    const abonnes: Abonne[] = [];
    let budgetMax = 0;

    type Section = 'articles' | 'abonnes' | 'parametres' | null;
    let sectionCourante: Section = null;

    for (const ligne of lignes) {
        if (ligne.includes('articles')) {
            sectionCourante = 'articles';
            continue;
        } else if (ligne.includes('abonnes')) {
            sectionCourante = 'abonnes';
            continue;
        } else if (ligne.includes('parametres')) {
            sectionCourante = 'parametres';
            continue;
        }

        const colonnes = ligne.split(';');

        if (sectionCourante === 'articles') {
            // a1;Monopoly Junior;SOC;PE;N;8;400
            const [id, designation, categorie, age, etat, prix, poids] = colonnes;
            articles.push(new Article(
                id,
                designation,
                categorie as Categorie,
                age as TrancheAge,
                etat as Etat,
                parseInt(prix),
                parseInt(poids)
            ));

        } else if (sectionCourante === 'abonnes') {
            // s1;Alice;PE;SOC,FIG,EVL,CON,LIV,EXT
            const [id, prenom, age, prefsRaw] = colonnes;
            const preferences = prefsRaw.split(',').map((p: string) => p.trim() as Categorie);
            abonnes.push(new Abonne(
                id,
                prenom,
                age as TrancheAge,
                preferences
            ));

        } else if (sectionCourante === 'parametres') {
            budgetMax = parseInt(ligne);
        }
    }

    return { articles, abonnes, budgetMax };
}
