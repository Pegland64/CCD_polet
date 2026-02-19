import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seed...');

  // Nettoyer la base
  await prisma.article.deleteMany();
  await prisma.box.deleteMany();
  await prisma.abonne.deleteMany();
  await prisma.campagne.deleteMany();

  // Créer des articles de test
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        designation: 'Monopoly Junior',
        categorie: 'SOC',
        trancheAge: 'PE',
        etat: 'N',
        prix: 8,
        poids: 400,
        statut: 'DISPONIBLE',
      },
    }),
    prisma.article.create({
      data: {
        designation: 'Barbie Aventurière',
        categorie: 'FIG',
        trancheAge: 'PE',
        etat: 'TB',
        prix: 5,
        poids: 300,
        statut: 'DISPONIBLE',
      },
    }),
    prisma.article.create({
      data: {
        designation: 'Puzzle éducatif',
        categorie: 'EVL',
        trancheAge: 'PE',
        etat: 'TB',
        prix: 7,
        poids: 350,
        statut: 'DISPONIBLE',
      },
    }),
    prisma.article.create({
      data: {
        designation: 'Cubes alphabet',
        categorie: 'CON',
        trancheAge: 'PE',
        etat: 'N',
        prix: 4,
        poids: 300,
        statut: 'DISPONIBLE',
      },
    }),
    prisma.article.create({
      data: {
        designation: 'Livre cache-cache',
        categorie: 'LIV',
        trancheAge: 'PE',
        etat: 'N',
        prix: 3,
        poids: 200,
        statut: 'DISPONIBLE',
      },
    }),
    prisma.article.create({
      data: {
        designation: 'Kapla 200 pièces',
        categorie: 'CON',
        trancheAge: 'EN',
        etat: 'B',
        prix: 10,
        poids: 600,
        statut: 'DISPONIBLE',
      },
    }),
    prisma.article.create({
      data: {
        designation: 'Cerf-volant Pirate',
        categorie: 'EXT',
        trancheAge: 'EN',
        etat: 'N',
        prix: 6,
        poids: 400,
        statut: 'DISPONIBLE',
      },
    }),
    prisma.article.create({
      data: {
        designation: 'Le Petit Nicolas',
        categorie: 'LIV',
        trancheAge: 'EN',
        etat: 'TB',
        prix: 5,
        poids: 200,
        statut: 'DISPONIBLE',
      },
    }),
  ]);

  console.log(`${articles.length} articles créés`);

  // Créer des abonnés de test
  const abonnes = await Promise.all([
    prisma.abonne.create({
      data: {
        nom: 'Dupont',
        prenom: 'Alice',
        email: 'alice.dupont@example.com',
        trancheAgeEnfant: 'PE',
        preferences: 'SOC,FIG,EVL,CON,LIV,EXT',
      },
    }),
    prisma.abonne.create({
      data: {
        nom: 'Martin',
        prenom: 'Bob',
        email: 'bob.martin@example.com',
        trancheAgeEnfant: 'EN',
        preferences: 'EXT,CON,SOC,EVL,FIG,LIV',
      },
    }),
    prisma.abonne.create({
      data: {
        nom: 'Durand',
        prenom: 'Clara',
        email: 'clara.durand@example.com',
        trancheAgeEnfant: 'PE',
        preferences: 'EVL,LIV,FIG,SOC,CON,EXT',
      },
    }),
  ]);

  console.log(`${abonnes.length} abonnés créés`);

  // Créer une campagne de test
  const campagne = await prisma.campagne.create({
    data: {
      nom: 'Campagne Test 2026',
      poidsMax: 1200,
      statut: 'BROUILLON',
    },
  });

  console.log(`Campagne "${campagne.nom}" créée`);
  console.log('Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
