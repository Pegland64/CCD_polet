import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seed...');

  // Nettoyer la base (ordre important pour les FK)
  await prisma.article.updateMany({ data: { boxId: null } });
  await prisma.box.deleteMany();
  await prisma.campagne.deleteMany();
  await prisma.utilisateur.deleteMany();
  await prisma.article.deleteMany();

  // ============================================
  // 40 ARTICLES — toutes catégories, tous âges, tous états
  // ============================================
  const articles = await prisma.article.createMany({
    data: [
      // --- BB (bébé 0-3 ans) ---
      { designation: 'Hochet coloré', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 4, poids: 120, statut: 'DISPONIBLE' },
      { designation: 'Mobile musical', categorie: 'EVL', trancheAge: 'BB', etat: 'TB', prix: 6, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Livre tissu animaux', categorie: 'LIV', trancheAge: 'BB', etat: 'N', prix: 5, poids: 150, statut: 'DISPONIBLE' },
      { designation: 'Tapis d\'éveil', categorie: 'EVL', trancheAge: 'BB', etat: 'TB', prix: 10, poids: 400, statut: 'DISPONIBLE' },
      { designation: 'Cubes de bain', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 3, poids: 180, statut: 'DISPONIBLE' },
      { designation: 'Peluche lapin', categorie: 'FIG', trancheAge: 'BB', etat: 'N', prix: 8, poids: 220, statut: 'DISPONIBLE' },
      { designation: 'Anneau de dentition', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 2, poids: 80, statut: 'DISPONIBLE' },

      // --- PE (petit enfant 3-6 ans) ---
      { designation: 'Monopoly Junior', categorie: 'SOC', trancheAge: 'PE', etat: 'N', prix: 8, poids: 400, statut: 'DISPONIBLE' },
      { designation: 'Barbie Aventurière', categorie: 'FIG', trancheAge: 'PE', etat: 'TB', prix: 5, poids: 300, statut: 'DISPONIBLE' },
      { designation: 'Puzzle éducatif 24p', categorie: 'EVL', trancheAge: 'PE', etat: 'TB', prix: 7, poids: 350, statut: 'DISPONIBLE' },
      { designation: 'Cubes alphabet', categorie: 'CON', trancheAge: 'PE', etat: 'N', prix: 4, poids: 300, statut: 'DISPONIBLE' },
      { designation: 'Livre cache-cache', categorie: 'LIV', trancheAge: 'PE', etat: 'N', prix: 3, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Dînette complète', categorie: 'FIG', trancheAge: 'PE', etat: 'B', prix: 6, poids: 450, statut: 'DISPONIBLE' },
      { designation: 'Memory animaux', categorie: 'SOC', trancheAge: 'PE', etat: 'TB', prix: 5, poids: 250, statut: 'DISPONIBLE' },
      { designation: 'Jeu de billes', categorie: 'EXT', trancheAge: 'PE', etat: 'N', prix: 3, poids: 300, statut: 'DISPONIBLE' },
      { designation: 'Lego Duplo ferme', categorie: 'CON', trancheAge: 'PE', etat: 'TB', prix: 12, poids: 500, statut: 'DISPONIBLE' },
      { designation: 'Livre mes premières histoires', categorie: 'LIV', trancheAge: 'PE', etat: 'N', prix: 4, poids: 180, statut: 'DISPONIBLE' },
      { designation: 'Jeu du mistigri', categorie: 'SOC', trancheAge: 'PE', etat: 'B', prix: 2, poids: 150, statut: 'DISPONIBLE' },
      { designation: 'Toboggan miniature', categorie: 'EXT', trancheAge: 'PE', etat: 'B', prix: 15, poids: 900, statut: 'DISPONIBLE' },

      // --- EN (enfant 6-10 ans) ---
      { designation: 'Kapla 200 pièces', categorie: 'CON', trancheAge: 'EN', etat: 'B', prix: 10, poids: 600, statut: 'DISPONIBLE' },
      { designation: 'Cerf-volant Pirate', categorie: 'EXT', trancheAge: 'EN', etat: 'N', prix: 6, poids: 400, statut: 'DISPONIBLE' },
      { designation: 'Le Petit Nicolas', categorie: 'LIV', trancheAge: 'EN', etat: 'TB', prix: 5, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Uno', categorie: 'SOC', trancheAge: 'EN', etat: 'N', prix: 4, poids: 150, statut: 'DISPONIBLE' },
      { designation: 'Figurine chevalier', categorie: 'FIG', trancheAge: 'EN', etat: 'TB', prix: 6, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Microscope enfant', categorie: 'EVL', trancheAge: 'EN', etat: 'N', prix: 14, poids: 550, statut: 'DISPONIBLE' },
      { designation: 'Lego City pompiers', categorie: 'CON', trancheAge: 'EN', etat: 'N', prix: 18, poids: 700, statut: 'DISPONIBLE' },
      { designation: 'Cluedo Junior', categorie: 'SOC', trancheAge: 'EN', etat: 'TB', prix: 9, poids: 450, statut: 'DISPONIBLE' },
      { designation: 'Vélo sans pédale', categorie: 'EXT', trancheAge: 'EN', etat: 'B', prix: 20, poids: 850, statut: 'DISPONIBLE' },
      { designation: 'Harry Potter tome 1', categorie: 'LIV', trancheAge: 'EN', etat: 'TB', prix: 7, poids: 300, statut: 'DISPONIBLE' },
      { designation: 'Kit expériences chimie', categorie: 'EVL', trancheAge: 'EN', etat: 'N', prix: 13, poids: 480, statut: 'DISPONIBLE' },

      // --- AD (adolescent 10+ ans) ---
      { designation: 'Catan', categorie: 'SOC', trancheAge: 'AD', etat: 'TB', prix: 15, poids: 800, statut: 'DISPONIBLE' },
      { designation: 'Figurine manga collector', categorie: 'FIG', trancheAge: 'AD', etat: 'N', prix: 12, poids: 350, statut: 'DISPONIBLE' },
      { designation: 'Puzzle 1000 pièces', categorie: 'EVL', trancheAge: 'AD', etat: 'N', prix: 10, poids: 500, statut: 'DISPONIBLE' },
      { designation: 'Frisbee freestyle', categorie: 'EXT', trancheAge: 'AD', etat: 'N', prix: 5, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Mille bornes', categorie: 'SOC', trancheAge: 'AD', etat: 'B', prix: 6, poids: 400, statut: 'DISPONIBLE' },
      { designation: 'Lego Architecture', categorie: 'CON', trancheAge: 'AD', etat: 'N', prix: 25, poids: 900, statut: 'DISPONIBLE' },
      { designation: 'Hunger Games tome 1', categorie: 'LIV', trancheAge: 'AD', etat: 'TB', prix: 8, poids: 350, statut: 'DISPONIBLE' },
      { designation: 'Trotinette freestyle', categorie: 'EXT', trancheAge: 'AD', etat: 'B', prix: 22, poids: 950, statut: 'DISPONIBLE' },
      { designation: '7 Wonders', categorie: 'SOC', trancheAge: 'AD', etat: 'N', prix: 18, poids: 700, statut: 'DISPONIBLE' },
      { designation: 'Kit électronique débutant', categorie: 'EVL', trancheAge: 'AD', etat: 'N', prix: 16, poids: 600, statut: 'DISPONIBLE' },
    ],
  });

  console.log(`${articles.count} articles créés`);

  // ============================================
  // 12 UTILISATEURS — toutes tranches d'âge
  // ============================================
  const utilisateurs = await prisma.utilisateur.createMany({
    data: [
      // PE
      { authProviderId: 'auth_alice',   nom: 'Dupont',    prenom: 'Alice',   email: 'alice.dupont@example.com',    trancheAgeEnfant: 'PE', preferencesCategories: 'SOC,FIG,EVL,CON,LIV,EXT' },
      { authProviderId: 'auth_clara',   nom: 'Durand',    prenom: 'Clara',   email: 'clara.durand@example.com',    trancheAgeEnfant: 'PE', preferencesCategories: 'EVL,LIV,FIG,SOC,CON,EXT' },
      { authProviderId: 'auth_emma',    nom: 'Lefebvre',  prenom: 'Emma',    email: 'emma.lefebvre@example.com',   trancheAgeEnfant: 'PE', preferencesCategories: 'FIG,SOC,LIV,EVL,CON,EXT' },
      { authProviderId: 'auth_sophie',  nom: 'Renard',    prenom: 'Sophie',  email: 'sophie.renard@example.com',   trancheAgeEnfant: 'PE', preferencesCategories: 'CON,EVL,SOC,FIG,EXT,LIV' },
      // EN
      { authProviderId: 'auth_bob',     nom: 'Martin',    prenom: 'Bob',     email: 'bob.martin@example.com',      trancheAgeEnfant: 'EN', preferencesCategories: 'EXT,CON,SOC,EVL,FIG,LIV' },
      { authProviderId: 'auth_lucas',   nom: 'Bernard',   prenom: 'Lucas',   email: 'lucas.bernard@example.com',   trancheAgeEnfant: 'EN', preferencesCategories: 'SOC,EVL,CON,LIV,EXT,FIG' },
      { authProviderId: 'auth_hugo',    nom: 'Petit',     prenom: 'Hugo',    email: 'hugo.petit@example.com',      trancheAgeEnfant: 'EN', preferencesCategories: 'CON,SOC,EXT,FIG,EVL,LIV' },
      // AD
      { authProviderId: 'auth_theo',    nom: 'Moreau',    prenom: 'Théo',    email: 'theo.moreau@example.com',     trancheAgeEnfant: 'AD', preferencesCategories: 'SOC,CON,EXT,EVL,FIG,LIV' },
      { authProviderId: 'auth_lea',     nom: 'Simon',     prenom: 'Léa',     email: 'lea.simon@example.com',       trancheAgeEnfant: 'AD', preferencesCategories: 'LIV,SOC,EVL,CON,FIG,EXT' },
      { authProviderId: 'auth_nathan',  nom: 'Laurent',   prenom: 'Nathan',  email: 'nathan.laurent@example.com',  trancheAgeEnfant: 'AD', preferencesCategories: 'EXT,SOC,CON,FIG,LIV,EVL' },
      // BB
      { authProviderId: 'auth_julie',   nom: 'Thomas',    prenom: 'Julie',   email: 'julie.thomas@example.com',    trancheAgeEnfant: 'BB', preferencesCategories: 'EVL,FIG,LIV,SOC,CON,EXT' },
      { authProviderId: 'auth_marie',   nom: 'Robert',    prenom: 'Marie',   email: 'marie.robert@example.com',    trancheAgeEnfant: 'BB', preferencesCategories: 'FIG,EVL,LIV,CON,SOC,EXT' },
    ],
  });

  console.log(`${utilisateurs.count} utilisateurs créés`);

  // ============================================
  // 3 CAMPAGNES dans des états différents
  // ============================================
  await prisma.campagne.create({
    data: { nom: 'Campagne Printemps 2026', poidsMax: 1200, statut: 'BROUILLON' },
  });

  await prisma.campagne.create({
    data: { nom: 'Campagne Hiver 2026', poidsMax: 1000, statut: 'BROUILLON' },
  });

  // Campagne VALIDÉE avec des boxes — pour tester la consultation abonné
  const utilisateurAlice  = await prisma.utilisateur.findUnique({ where: { email: 'alice.dupont@example.com' } });
  const utilisateurBob    = await prisma.utilisateur.findUnique({ where: { email: 'bob.martin@example.com' } });
  const utilisateurLea    = await prisma.utilisateur.findUnique({ where: { email: 'lea.simon@example.com' } });

  const articlesAlice = await prisma.article.findMany({
    where: { designation: { in: ['Monopoly Junior', 'Barbie Aventurière', 'Puzzle éducatif 24p'] } },
  });
  const articlesBob = await prisma.article.findMany({
    where: { designation: { in: ['Cerf-volant Pirate', 'Kapla 200 pièces', 'Le Petit Nicolas'] } },
  });
  const articlesLea = await prisma.article.findMany({
    where: { designation: { in: ['Catan', 'Hunger Games tome 1', 'Puzzle 1000 pièces'] } },
  });

  const campagneValidee = await prisma.campagne.create({
    data: {
      nom: 'Campagne Noël 2025',
      poidsMax: 1200,
      statut: 'VALIDEE',
      totalScore: 156,
      boxes: {
        create: [
          {
            score: 56,
            poidsTotal: articlesAlice.reduce((s, a) => s + a.poids, 0),
            prixTotal:  articlesAlice.reduce((s, a) => s + a.prix,  0),
            utilisateurId: utilisateurAlice!.id,
            articles: { connect: articlesAlice.map(a => ({ id: a.id })) },
          },
          {
            score: 48,
            poidsTotal: articlesBob.reduce((s, a) => s + a.poids, 0),
            prixTotal:  articlesBob.reduce((s, a) => s + a.prix,  0),
            utilisateurId: utilisateurBob!.id,
            articles: { connect: articlesBob.map(a => ({ id: a.id })) },
          },
          {
            score: 52,
            poidsTotal: articlesLea.reduce((s, a) => s + a.poids, 0),
            prixTotal:  articlesLea.reduce((s, a) => s + a.prix,  0),
            utilisateurId: utilisateurLea!.id,
            articles: { connect: articlesLea.map(a => ({ id: a.id })) },
          },
        ],
      },
    },
  });

  // Marquer ces articles comme VALIDE
  await prisma.article.updateMany({
    where: { id: { in: [...articlesAlice, ...articlesBob, ...articlesLea].map(a => a.id) } },
    data: { statut: 'VALIDE' },
  });
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
