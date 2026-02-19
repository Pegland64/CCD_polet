CREATE TABLE utilisateur (
                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             auth_provider_id VARCHAR(255) UNIQUE NOT NULL,
                             email VARCHAR(255) UNIQUE NOT NULL,
                             nom VARCHAR(100),
                             prenom VARCHAR(100),
                             role VARCHAR(20) DEFAULT 'abonne',
                             tranche_age_enfant VARCHAR(2),
                             preferences_categories VARCHAR(255)
);

INSERT INTO articles 
(nom_article, categorie, tranche_age, etat, prix, poids)
VALUES
('Monopoly Junior', 'Jeu de société', 'Petit enfant', 'Neuf', 8.00, 400),
('Barbie Aventurière', 'Figurine', 'Petit enfant', 'Très bon état', 5.00, 300),
('Kapla 200 pièces', 'Jeu de construction', 'Enfant', 'Bon état', 10.00, 600);