CREATE TABLE IF NOT EXISTS articles (
    id_article INT AUTO_INCREMENT PRIMARY KEY,
    nom_article VARCHAR(150) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    tranche_age VARCHAR(50) NOT NULL,
    etat VARCHAR(50) NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    poids INT NOT NULL
);

INSERT INTO articles 
(nom_article, categorie, tranche_age, etat, prix, poids)
VALUES
('Monopoly Junior', 'Jeu de société', 'Petit enfant', 'Neuf', 8.00, 400),
('Barbie Aventurière', 'Figurine', 'Petit enfant', 'Très bon état', 5.00, 300),
('Kapla 200 pièces', 'Jeu de construction', 'Enfant', 'Bon état', 10.00, 600);