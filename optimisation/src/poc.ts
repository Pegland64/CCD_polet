
import * as fs from 'fs';
import * as path from 'path';

const inputDir = '/input_csv';
const outputDir = '/output_csv';
const outputFile = path.join(outputDir, 'result.txt');

console.log("Démarrage du POC TypeScript...");

function formatDate(date: Date): string {
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

try {
    console.log(`\n--- Lecture des fichiers dans ${inputDir} ---`);
    if (fs.existsSync(inputDir)) {
        const files = fs.readdirSync(inputDir);
        let outputContent = `Traitement effectué le ${formatDate(new Date())}\n`;
        outputContent += "--------------------------------------------------\n";

        if (files.length > 0) {
            for (const filename of files) {
                const filepath = path.join(inputDir, filename);
                const stat = fs.statSync(filepath);

                if (stat.isFile()) {
                    console.log(`📄 Fichier trouvé : ${filename}`);
                    outputContent += `\n--- Contenu de ${filename} ---\n`;
                    try {
                        const content = fs.readFileSync(filepath, 'utf-8');
                        console.log("Contenu :");
                        console.log(content);
                        outputContent += content + "\n";
                    } catch (err) {
                        console.error(`Erreur lors de la lecture de ${filename}: ${err}`);
                        outputContent += `Erreur lecture ${filename}: ${err}\n`;
                    }
                }
            }
        } else {
            console.log(`Le dossier ${inputDir} est vide.`);
            outputContent += `Le dossier ${inputDir} est vide.\n`;
        }

        console.log(`\n--- Écriture dans ${outputDir} ---`);
        fs.writeFileSync(outputFile, outputContent);
        console.log(`Fichier ${outputFile} mis à jour avec le contenu des entrées ✅`);

    } else {
        console.error(`Le dossier ${inputDir} n'existe pas.`);
    }
} catch (err) {
    console.error(`Une erreur est survenue : ${err}`);
}
