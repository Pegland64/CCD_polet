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
  // 100 ARTICLES — toutes catégories, tous âges, tous états
  // Assez pour que des articles restent DISPONIBLES même après
  // que le service d'optimisation ait créé les boxes (≈36 articles consommés)
  // ============================================
  const articles = await prisma.article.createMany({
    data: [
      // ── BB (bébé 0-3 ans) — 22 articles ──────────────────────────────────
      { designation: 'Hochet coloré', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 4, poids: 120, statut: 'DISPONIBLE' },
      { designation: 'Mobile musical', categorie: 'EVL', trancheAge: 'BB', etat: 'TB', prix: 6, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Livre tissu animaux', categorie: 'LIV', trancheAge: 'BB', etat: 'N', prix: 5, poids: 150, statut: 'DISPONIBLE' },
      { designation: "Tapis d'éveil", categorie: 'EVL', trancheAge: 'BB', etat: 'TB', prix: 10, poids: 400, statut: 'DISPONIBLE' },
      { designation: 'Cubes de bain', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 3, poids: 180, statut: 'DISPONIBLE' },
      { designation: 'Peluche lapin', categorie: 'FIG', trancheAge: 'BB', etat: 'N', prix: 8, poids: 220, statut: 'DISPONIBLE' },
      { designation: 'Anneau de dentition', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 2, poids: 80, statut: 'DISPONIBLE' },
      { designation: 'Balles de préhension', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 3, poids: 100, statut: 'DISPONIBLE' },
      { designation: 'Hochet girafe Sophie', categorie: 'EVL', trancheAge: 'BB', etat: 'TB', prix: 12, poids: 150, statut: 'DISPONIBLE' },
      { designation: 'Veilleuse musicale', categorie: 'EVL', trancheAge: 'BB', etat: 'B', prix: 15, poids: 300, statut: 'DISPONIBLE' },
      { designation: 'Livre bain animaux de mer', categorie: 'LIV', trancheAge: 'BB', etat: 'N', prix: 4, poids: 120, statut: 'DISPONIBLE' },
      { designation: 'Portique d\'éveil', categorie: 'EVL', trancheAge: 'BB', etat: 'B', prix: 20, poids: 600, statut: 'DISPONIBLE' },
      { designation: 'Peluche ours polaire', categorie: 'FIG', trancheAge: 'BB', etat: 'TB', prix: 9, poids: 250, statut: 'DISPONIBLE' },
      { designation: 'Jouet d\'activité cube', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 14, poids: 500, statut: 'DISPONIBLE' },
      { designation: 'Miroir d\'éveil bébé', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 6, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Boîte à formes', categorie: 'EVL', trancheAge: 'BB', etat: 'TB', prix: 8, poids: 350, statut: 'DISPONIBLE' },
      { designation: 'Livre cartonné mes premiers mots', categorie: 'LIV', trancheAge: 'BB', etat: 'N', prix: 5, poids: 180, statut: 'DISPONIBLE' },
      { designation: 'Figurine renard doux', categorie: 'FIG', trancheAge: 'BB', etat: 'N', prix: 7, poids: 180, statut: 'DISPONIBLE' },
      { designation: 'Jouet de bain canard', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 2, poids: 60, statut: 'DISPONIBLE' },
      { designation: 'Trotteur bébé', categorie: 'EVL', trancheAge: 'BB', etat: 'B', prix: 18, poids: 900, statut: 'DISPONIBLE' },
      { designation: 'Comptine musicale bébé', categorie: 'EVL', trancheAge: 'BB', etat: 'N', prix: 5, poids: 140, statut: 'DISPONIBLE' },
      { designation: 'Livre sonore des animaux', categorie: 'LIV', trancheAge: 'BB', etat: 'TB', prix: 9, poids: 280, statut: 'DISPONIBLE' },

      // ── PE (petit enfant 3-6 ans) — 26 articles ──────────────────────────
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
      { designation: 'Figurine Playmobil pirate', categorie: 'FIG', trancheAge: 'PE', etat: 'N', prix: 6, poids: 280, statut: 'DISPONIBLE' },
      { designation: 'Loto des couleurs', categorie: 'SOC', trancheAge: 'PE', etat: 'N', prix: 4, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Dominos images', categorie: 'SOC', trancheAge: 'PE', etat: 'TB', prix: 5, poids: 300, statut: 'DISPONIBLE' },
      { designation: 'Pâte à modeler 6 couleurs', categorie: 'CON', trancheAge: 'PE', etat: 'N', prix: 7, poids: 350, statut: 'DISPONIBLE' },
      { designation: 'Puzzle en bois 16p', categorie: 'EVL', trancheAge: 'PE', etat: 'TB', prix: 8, poids: 400, statut: 'DISPONIBLE' },
      { designation: 'Jeu de société Pictino', categorie: 'SOC', trancheAge: 'PE', etat: 'N', prix: 6, poids: 300, statut: 'DISPONIBLE' },
      { designation: 'Garage Playmobil', categorie: 'FIG', trancheAge: 'PE', etat: 'B', prix: 18, poids: 700, statut: 'DISPONIBLE' },
      { designation: 'Ballon de plage', categorie: 'EXT', trancheAge: 'PE', etat: 'N', prix: 2, poids: 100, statut: 'DISPONIBLE' },
      { designation: 'Jeu premier âge Orchard', categorie: 'SOC', trancheAge: 'PE', etat: 'TB', prix: 10, poids: 350, statut: 'DISPONIBLE' },
      { designation: 'Livre pop-up sous-marin', categorie: 'LIV', trancheAge: 'PE', etat: 'N', prix: 6, poids: 220, statut: 'DISPONIBLE' },
      { designation: 'Maison de poupée', categorie: 'FIG', trancheAge: 'PE', etat: 'B', prix: 22, poids: 800, statut: 'DISPONIBLE' },
      { designation: 'Tampons encreurs fruits', categorie: 'CON', trancheAge: 'PE', etat: 'N', prix: 4, poids: 180, statut: 'DISPONIBLE' },
      { designation: 'Voiture RC débutant', categorie: 'EXT', trancheAge: 'PE', etat: 'B', prix: 14, poids: 500, statut: 'DISPONIBLE' },

      // ── EN (enfant 6-10 ans) — 26 articles ──────────────────────────────
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
      { designation: 'Lego Technic grue', categorie: 'CON', trancheAge: 'EN', etat: 'TB', prix: 22, poids: 850, statut: 'DISPONIBLE' },
      { designation: 'Jeu Dobble', categorie: 'SOC', trancheAge: 'EN', etat: 'N', prix: 5, poids: 180, statut: 'DISPONIBLE' },
      { designation: 'Puzzle 200 pièces espace', categorie: 'EVL', trancheAge: 'EN', etat: 'N', prix: 8, poids: 350, statut: 'DISPONIBLE' },
      { designation: 'Jeu de cartes 7 familles', categorie: 'SOC', trancheAge: 'EN', etat: 'TB', prix: 3, poids: 120, statut: 'DISPONIBLE' },
      { designation: 'Tom-Tom et Nana BD', categorie: 'LIV', trancheAge: 'EN', etat: 'B', prix: 4, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Jeu de fléchettes plastique', categorie: 'EXT', trancheAge: 'EN', etat: 'N', prix: 7, poids: 350, statut: 'DISPONIBLE' },
      { designation: 'Figurine Power Rangers', categorie: 'FIG', trancheAge: 'EN', etat: 'B', prix: 5, poids: 220, statut: 'DISPONIBLE' },
      { designation: 'Robot éducatif Cubetto', categorie: 'EVL', trancheAge: 'EN', etat: 'N', prix: 16, poids: 600, statut: 'DISPONIBLE' },
      { designation: 'Jeu Rush Hour', categorie: 'EVL', trancheAge: 'EN', etat: 'TB', prix: 12, poids: 400, statut: 'DISPONIBLE' },
      { designation: 'Jeu Sushi Go', categorie: 'SOC', trancheAge: 'EN', etat: 'N', prix: 7, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Boomerang souple', categorie: 'EXT', trancheAge: 'EN', etat: 'N', prix: 4, poids: 80, statut: 'DISPONIBLE' },
      { designation: 'Série Chair de Poule', categorie: 'LIV', trancheAge: 'EN', etat: 'B', prix: 5, poids: 220, statut: 'DISPONIBLE' },
      { designation: 'Kit peinture aquarelle', categorie: 'CON', trancheAge: 'EN', etat: 'N', prix: 9, poids: 300, statut: 'DISPONIBLE' },
      { designation: 'Skateboard débutant', categorie: 'EXT', trancheAge: 'EN', etat: 'B', prix: 18, poids: 900, statut: 'DISPONIBLE' },
      { designation: 'Playmobil château fort', categorie: 'FIG', trancheAge: 'EN', etat: 'TB', prix: 25, poids: 1000, statut: 'DISPONIBLE' },

      // ── AD (adolescent 10+ ans) — 26 articles ───────────────────────────
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
      { designation: 'Jeu Ticket to Ride', categorie: 'SOC', trancheAge: 'AD', etat: 'TB', prix: 20, poids: 900, statut: 'DISPONIBLE' },
      { designation: 'Jeu Codenames', categorie: 'SOC', trancheAge: 'AD', etat: 'N', prix: 14, poids: 500, statut: 'DISPONIBLE' },
      { designation: 'Roman Divergente tome 1', categorie: 'LIV', trancheAge: 'AD', etat: 'TB', prix: 7, poids: 320, statut: 'DISPONIBLE' },
      { designation: 'Jeu Azul', categorie: 'SOC', trancheAge: 'AD', etat: 'N', prix: 18, poids: 700, statut: 'DISPONIBLE' },
      { designation: 'Yoyo professionnel', categorie: 'EXT', trancheAge: 'AD', etat: 'N', prix: 8, poids: 150, statut: 'DISPONIBLE' },
      { designation: 'Lego Technic F1', categorie: 'CON', trancheAge: 'AD', etat: 'N', prix: 30, poids: 1100, statut: 'DISPONIBLE' },
      { designation: 'Jeu Pandemic', categorie: 'SOC', trancheAge: 'AD', etat: 'TB', prix: 17, poids: 800, statut: 'DISPONIBLE' },
      { designation: 'BD Astérix collector', categorie: 'LIV', trancheAge: 'AD', etat: 'B', prix: 9, poids: 350, statut: 'DISPONIBLE' },
      { designation: 'Kit origami avancé', categorie: 'CON', trancheAge: 'AD', etat: 'N', prix: 11, poids: 250, statut: 'DISPONIBLE' },
      { designation: 'Ballon de foot taille 5', categorie: 'EXT', trancheAge: 'AD', etat: 'B', prix: 12, poids: 450, statut: 'DISPONIBLE' },
      { designation: 'Figurine Funko Pop collector', categorie: 'FIG', trancheAge: 'AD', etat: 'N', prix: 10, poids: 200, statut: 'DISPONIBLE' },
      { designation: 'Jeu Kingdomino', categorie: 'SOC', trancheAge: 'AD', etat: 'TB', prix: 13, poids: 600, statut: 'DISPONIBLE' },
      { designation: 'Journal créatif ado', categorie: 'LIV', trancheAge: 'AD', etat: 'N', prix: 8, poids: 300, statut: 'DISPONIBLE' },
      { designation: 'Jeu Dixit', categorie: 'SOC', trancheAge: 'AD', etat: 'TB', prix: 16, poids: 700, statut: 'DISPONIBLE' },
      { designation: 'Vélo BMX freestyle', categorie: 'EXT', trancheAge: 'AD', etat: 'B', prix: 35, poids: 1200, statut: 'DISPONIBLE' },
    ],
  });

  console.log(`${articles.count} articles créés`);

  // ============================================
  // 12 UTILISATEURS — toutes tranches d'âge
  // ============================================
  const utilisateurs = await prisma.utilisateur.createMany({
    data: [
      // PE
      { authProviderId: 'auth_alice', nom: 'Dupont', prenom: 'Alice', email: 'alice.dupont@example.com', trancheAgeEnfant: 'PE', preferencesCategories: 'SOC,FIG,EVL,CON,LIV,EXT' },
      { authProviderId: 'auth_clara', nom: 'Durand', prenom: 'Clara', email: 'clara.durand@example.com', trancheAgeEnfant: 'PE', preferencesCategories: 'EVL,LIV,FIG,SOC,CON,EXT' },
      { authProviderId: 'auth_emma', nom: 'Lefebvre', prenom: 'Emma', email: 'emma.lefebvre@example.com', trancheAgeEnfant: 'PE', preferencesCategories: 'FIG,SOC,LIV,EVL,CON,EXT' },
      { authProviderId: 'auth_sophie', nom: 'Renard', prenom: 'Sophie', email: 'sophie.renard@example.com', trancheAgeEnfant: 'PE', preferencesCategories: 'CON,EVL,SOC,FIG,EXT,LIV' },
      // EN
      { authProviderId: 'auth_bob', nom: 'Martin', prenom: 'Bob', email: 'bob.martin@example.com', trancheAgeEnfant: 'EN', preferencesCategories: 'EXT,CON,SOC,EVL,FIG,LIV' },
      { authProviderId: 'auth_lucas', nom: 'Bernard', prenom: 'Lucas', email: 'lucas.bernard@example.com', trancheAgeEnfant: 'EN', preferencesCategories: 'SOC,EVL,CON,LIV,EXT,FIG' },
      { authProviderId: 'auth_hugo', nom: 'Petit', prenom: 'Hugo', email: 'hugo.petit@example.com', trancheAgeEnfant: 'EN', preferencesCategories: 'CON,SOC,EXT,FIG,EVL,LIV' },
      // AD
      { authProviderId: 'auth_theo', nom: 'Moreau', prenom: 'Théo', email: 'theo.moreau@example.com', trancheAgeEnfant: 'AD', preferencesCategories: 'SOC,CON,EXT,EVL,FIG,LIV' },
      { authProviderId: 'auth_lea', nom: 'Simon', prenom: 'Léa', email: 'lea.simon@example.com', trancheAgeEnfant: 'AD', preferencesCategories: 'LIV,SOC,EVL,CON,FIG,EXT' },
      { authProviderId: 'auth_nathan', nom: 'Laurent', prenom: 'Nathan', email: 'nathan.laurent@example.com', trancheAgeEnfant: 'AD', preferencesCategories: 'EXT,SOC,CON,FIG,LIV,EVL' },
      // BB
      { authProviderId: 'auth_julie', nom: 'Thomas', prenom: 'Julie', email: 'julie.thomas@example.com', trancheAgeEnfant: 'BB', preferencesCategories: 'EVL,FIG,LIV,SOC,CON,EXT' },
      { authProviderId: 'auth_marie', nom: 'Robert', prenom: 'Marie', email: 'marie.robert@example.com', trancheAgeEnfant: 'BB', preferencesCategories: 'FIG,EVL,LIV,CON,SOC,EXT' },
    ],
  });

  console.log(`${utilisateurs.count} utilisateurs créés`);

  // ============================================
  // CAMPAGNE VALIDÉE — données historiques de démonstration
  // Articles créés directement en VALIDE pour ne PAS piocher dans le pool DISPONIBLE
  // ============================================
  const utilisateurAlice = await prisma.utilisateur.findUnique({ where: { email: 'alice.dupont@example.com' } });
  const utilisateurBob = await prisma.utilisateur.findUnique({ where: { email: 'bob.martin@example.com' } });
  const utilisateurLea = await prisma.utilisateur.findUnique({ where: { email: 'lea.simon@example.com' } });

  // Ces articles sont créés directement VALIDE — ils ne sont jamais DISPONIBLES
  await prisma.article.createMany({
    data: [
      { designation: 'Spirographe jouet', categorie: 'CON', trancheAge: 'PE', etat: 'N', prix: 9, poids: 350, statut: 'VALIDE' },
      { designation: 'Savane en peluches', categorie: 'FIG', trancheAge: 'PE', etat: 'TB', prix: 12, poids: 400, statut: 'VALIDE' },
      { designation: 'Mon premier atlas', categorie: 'LIV', trancheAge: 'PE', etat: 'N', prix: 7, poids: 280, statut: 'VALIDE' },
      { designation: 'Meccano 25 modèles', categorie: 'CON', trancheAge: 'EN', etat: 'B', prix: 18, poids: 750, statut: 'VALIDE' },
      { designation: 'Toupie Beyblade', categorie: 'EXT', trancheAge: 'EN', etat: 'N', prix: 8, poids: 200, statut: 'VALIDE' },
      { designation: 'Geronimo Stilton tome 1', categorie: 'LIV', trancheAge: 'EN', etat: 'TB', prix: 5, poids: 220, statut: 'VALIDE' },
      { designation: 'Jeu Wingspan', categorie: 'SOC', trancheAge: 'AD', etat: 'N', prix: 22, poids: 900, statut: 'VALIDE' },
      { designation: 'Le Seigneur des Anneaux', categorie: 'LIV', trancheAge: 'AD', etat: 'TB', prix: 10, poids: 450, statut: 'VALIDE' },
      { designation: 'Puzzle 500p monde', categorie: 'EVL', trancheAge: 'AD', etat: 'N', prix: 11, poids: 400, statut: 'VALIDE' },
    ],
  });

  const findValide = (nom: string) => prisma.article.findFirst({ where: { designation: nom, statut: 'VALIDE' } });
  const [spirographe, savane, atlas, meccano, toupie, geronimo, wingspan, sda, puzzle500] = await Promise.all([
    findValide('Spirographe jouet'), findValide('Savane en peluches'), findValide('Mon premier atlas'),
    findValide('Meccano 25 modèles'), findValide('Toupie Beyblade'), findValide('Geronimo Stilton tome 1'),
    findValide('Jeu Wingspan'), findValide('Le Seigneur des Anneaux'), findValide('Puzzle 500p monde'),
  ]);

  await prisma.campagne.create({
    data: {
      nom: 'Campagne Noël 2025',
      poidsMax: 1200,
      statut: 'VALIDEE',
      totalScore: 120,
      boxes: {
        create: [
          {
            score: 42,
            poidsTotal: spirographe!.poids + savane!.poids + atlas!.poids,
            prixTotal: spirographe!.prix + savane!.prix + atlas!.prix,
            utilisateurId: utilisateurAlice!.id,
            articles: { connect: [spirographe!, savane!, atlas!].map(a => ({ id: a!.id })) },
          },
          {
            score: 38,
            poidsTotal: meccano!.poids + toupie!.poids + geronimo!.poids,
            prixTotal: meccano!.prix + toupie!.prix + geronimo!.prix,
            utilisateurId: utilisateurBob!.id,
            articles: { connect: [meccano!, toupie!, geronimo!].map(a => ({ id: a!.id })) },
          },
          {
            score: 40,
            poidsTotal: wingspan!.poids + sda!.poids + puzzle500!.poids,
            prixTotal: wingspan!.prix + sda!.prix + puzzle500!.prix,
            utilisateurId: utilisateurLea!.id,
            articles: { connect: [wingspan!, sda!, puzzle500!].map(a => ({ id: a!.id })) },
          },
        ],
      },
    },
  });

  // ============================================
  // UNE SEULE CAMPAGNE BROUILLON pour les tests
  // ============================================
  await prisma.campagne.create({
    data: { nom: 'Campagne Printemps 2026', poidsMax: 1200, statut: 'BROUILLON' },
  });

  console.log('Seed terminé avec succès !');
  console.log(`    ${articles.count} articles DISPONIBLES + 9 VALIDE (historique) en base`);
  console.log(`    ${utilisateurs.count} abonnés`);
  console.log('    2 campagnes (1 BROUILLON "Printemps 2026", 1 VALIDEE "Noël 2025")');
  console.log('');
  console.log('  ℹ️  Pour retester l\'optimisation : ./reset-test.sh');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
