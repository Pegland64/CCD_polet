#!/usr/bin/env python3
"""Génère les jeux d'essai complexes pb6 et pb7 pour ToyBoxing."""

import random

random.seed(2026)

CATEGORIES = ["SOC", "FIG", "CON", "EXT", "EVL", "LIV"]
AGES = ["BB", "PE", "EN", "AD"]
ETATS = ["N", "TB", "B"]

# Noms de jouets par catégorie et tranche d'âge
NOMS = {
    ("SOC", "BB"): ["Loto découverte bébé", "Mon premier puzzle", "Jeu d'encastrement formes"],
    ("SOC", "PE"): ["Uno Junior", "Loto des animaux", "Dominos couleurs", "Memory animaux",
                     "Jeu de l'oie Junior", "Dobble Kids", "Mon premier verger"],
    ("SOC", "EN"): ["Cluedo Junior", "Puissance 4", "Dobble", "Risk Junior", "Jungle Speed",
                     "Jeu de mémoire", "Bataille navale", "Qui est-ce"],
    ("SOC", "AD"): ["Monopoly", "Dixit", "7 Wonders", "Catan", "Trivial Pursuit",
                     "Codenames", "Azul", "Splendor"],
    ("FIG", "BB"): ["Sophie la Girafe", "Doudou lapin", "Peluche musicale chat",
                     "Peluche mouton"],
    ("FIG", "PE"): ["Barbie princesse", "Playmobil ferme", "Poupée Clara",
                     "Figurine dinosaure", "Peluche ours géant", "Playmobil école"],
    ("FIG", "EN"): ["Playmobil chevalier", "Figurine dragon", "Figurine super-héros",
                     "Playmobil pirate", "Figurine cheval", "Peluche panda"],
    ("FIG", "AD"): ["Figurine collector", "Figurine manga", "Maquette personnage",
                     "Figurine Star Wars"],
    ("CON", "BB"): ["Cubes souples", "Mega Bloks bébé", "Blocs à empiler",
                     "Tour empilable"],
    ("CON", "PE"): ["Duplo ferme", "Cubes alphabet", "Clipo animaux", "Plus-Plus Mini",
                     "Duplo train", "Briques souples"],
    ("CON", "EN"): ["Lego City caserne", "Kapla 200 pièces", "Meccano voiture",
                     "Lego Friends", "Lego Ninjago", "Geomag"],
    ("CON", "AD"): ["Lego Technic", "Maquette avion", "Meccano complexe",
                     "Lego Architecture", "Maquette bateau"],
    ("EXT", "BB"): ["Tapis d'éveil", "Ballon mousse", "Portique bébé"],
    ("EXT", "PE"): ["Ballon sauteur", "Trottinette 3 roues", "Cerf-volant papillon",
                     "Toboggan pliable", "Jeu de quilles"],
    ("EXT", "EN"): ["Corde à sauter", "Frisbee", "Raquettes badminton",
                     "Ballon de foot", "Cerf-volant pirate", "Diabolo"],
    ("EXT", "AD"): ["Skateboard", "Slackline", "Pétanque", "Boomerang"],
    ("EVL", "BB"): ["Hochet musical", "Boîte à formes bébé", "Boulier bébé",
                     "Livre tissu sensoriel", "Tapis sensoriel"],
    ("EVL", "PE"): ["Puzzle animaux", "Xylophone", "Tablette dessin magique",
                     "Mon premier imagier", "Jeu de laçage", "Perles à enfiler"],
    ("EVL", "EN"): ["Globe interactif", "Kit science volcans", "Microscope junior",
                     "Puzzle géant 100p", "Kit électricité", "Tangram"],
    ("EVL", "AD"): ["Kit Arduino", "Kit robotique", "Télescope junior",
                     "Kit chimie", "Kit programmation"],
    ("LIV", "BB"): ["Livre tissu jungle", "Imagier bébé animaux", "Livre de bain",
                     "Livre d'images bébé"],
    ("LIV", "PE"): ["T'choupi à l'école", "Livre cache-cache", "Les animaux de la ferme",
                     "Mon premier atlas", "Petit Ours Brun"],
    ("LIV", "EN"): ["Le Petit Nicolas", "Chair de Poule T1", "Le Petit Prince",
                     "Journal d'un dégonflé", "Max et Lili"],
    ("LIV", "AD"): ["Harry Potter T1", "Manga One Piece T1", "Percy Jackson T1",
                     "Les Trois Mousquetaires", "Manga Naruto T1"],
}

# Fourchettes de prix et poids par tranche d'âge
PRIX_RANGE = {"BB": (3, 12), "PE": (3, 15), "EN": (5, 20), "AD": (8, 25)}
POIDS_RANGE = {
    "SOC": (150, 600), "FIG": (80, 350), "CON": (200, 800),
    "EXT": (100, 900), "EVL": (50, 600), "LIV": (80, 400),
}

PRENOMS = [
    "Emma", "Lucas", "Chloé", "Hugo", "Inès", "Léa", "Nathan", "Jade",
    "Tom", "Camille", "Mathis", "Sarah", "Julie", "Éric", "Marie",
    "Pierre", "Claire", "Denis", "Nadia", "Olivier",
]


def gen_article(idx, cat, age, used_names):
    """Génère un article avec un nom réaliste."""
    noms_dispo = [n for n in NOMS.get((cat, age), [f"{cat} {age}"]) if n not in used_names]
    if not noms_dispo:
        noms_dispo = [f"{cat} {age} #{idx}"]
    nom = random.choice(noms_dispo)
    used_names.add(nom)
    etat = random.choice(ETATS)
    prix_min, prix_max = PRIX_RANGE[age]
    prix = random.randint(prix_min, prix_max)
    poids_min, poids_max = POIDS_RANGE[cat]
    poids = random.randint(poids_min, poids_max)
    # Arrondir le poids aux 50g
    poids = round(poids / 50) * 50
    poids = max(50, poids)
    return f"a{idx};{nom};{cat};{age};{etat};{prix};{poids}"


def gen_abonne(idx, prenom, age):
    """Génère un abonné avec des préférences aléatoires."""
    prefs = CATEGORIES[:]
    random.shuffle(prefs)
    prefs_str = ",".join(prefs)
    return f"s{idx};{prenom};{age};{prefs_str}"


def gen_problem(nb_articles, subscribers_ages, wmax, filename):
    """Génère un problème complet."""
    # Répartir les articles par tranche d'âge
    # On veut plus d'articles pour les tranches avec plusieurs abonnés
    age_counts = {}
    for age in subscribers_ages:
        age_counts[age] = age_counts.get(age, 0) + 1

    # Calculer la distribution d'articles
    total_parts = sum(max(2, count * 2) for count in age_counts.values())
    articles_per_age = {}
    remaining = nb_articles
    for age, count in sorted(age_counts.items()):
        parts = max(2, count * 2)
        n = max(3, round(nb_articles * parts / total_parts))
        articles_per_age[age] = n
        remaining -= n

    # Distribuer le reste
    for age in sorted(age_counts.keys(), key=lambda a: age_counts[a], reverse=True):
        if remaining <= 0:
            break
        articles_per_age[age] += remaining
        remaining = 0

    # Ajuster si on a trop
    total = sum(articles_per_age.values())
    while total > nb_articles:
        for age in sorted(articles_per_age.keys(), key=lambda a: articles_per_age[a], reverse=True):
            if total <= nb_articles:
                break
            if articles_per_age[age] > 3:
                articles_per_age[age] -= 1
                total -= 1

    # Générer les articles
    used_names = set()
    articles = []
    idx = 1
    for age in AGES:
        n = articles_per_age.get(age, 0)
        if n == 0:
            continue
        # Répartir sur les catégories (au moins 1 par catégorie si possible)
        cats = []
        if n >= len(CATEGORIES):
            cats = CATEGORIES[:]
            for _ in range(n - len(CATEGORIES)):
                cats.append(random.choice(CATEGORIES))
        else:
            cats = random.sample(CATEGORIES, n)
        random.shuffle(cats)
        for cat in cats:
            articles.append(gen_article(idx, cat, age, used_names))
            idx += 1

    # Générer les abonnés
    prenoms_used = set()
    abonnes = []
    for i, age in enumerate(subscribers_ages):
        prenom = PRENOMS[i]
        prenoms_used.add(prenom)
        abonnes.append(gen_abonne(i + 1, prenom, age))

    # Écrire le fichier
    with open(filename, "w", encoding="utf-8") as f:
        f.write("articles\n")
        for a in articles:
            f.write(a + "\n")
        f.write("\nabonnes\n")
        for ab in abonnes:
            f.write(ab + "\n")
        f.write(f"\nparametres\n{wmax}\n")

    print(f"  {filename}: {len(articles)} articles, {len(abonnes)} abonnés, Wmax={wmax}")
    # Résumé par tranche d'âge
    for age in AGES:
        n = articles_per_age.get(age, 0)
        subs = sum(1 for a in subscribers_ages if a == age)
        if n > 0 or subs > 0:
            print(f"    {age}: {n} articles, {subs} abonnés")


print("Génération de pb6 (50 articles, 12 abonnés)...")
# 12 abonnés : 4 PE, 4 EN, 2 BB, 2 AD → compétition dans chaque tranche
gen_problem(
    nb_articles=50,
    subscribers_ages=["PE", "PE", "PE", "PE", "EN", "EN", "EN", "EN", "BB", "BB", "AD", "AD"],
    wmax=1500,
    filename="pb6.csv",
)

print()
print("Génération de pb7 (100 articles, 20 abonnés)...")
# 20 abonnés : 6 PE, 6 EN, 4 BB, 4 AD → forte compétition partout
gen_problem(
    nb_articles=100,
    subscribers_ages=["PE"] * 6 + ["EN"] * 6 + ["BB"] * 4 + ["AD"] * 4,
    wmax=2000,
    filename="pb7.csv",
)

print()
print("Génération terminée.")
