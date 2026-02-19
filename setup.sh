#!/bin/bash

# Script de setup pour les secrets par défauts

# setup des secrets par défauts

# si le dossier secrets n'existe pas, on le crée
if [ ! -d "secrets" ]; then
    mkdir secrets
fi

# si le fichier db_password.txt n'existe pas, on le crée
if [ ! -f "secrets/db_password.txt" ]; then
    echo "password" > secrets/db_password.txt
fi

# si le fichier db_root_password.txt n'existe pas, on le crée
if [ ! -f "secrets/db_root_password.txt" ]; then
    echo "rootpassword" > secrets/db_root_password.txt
fi

# si le fichier db_user.txt n'existe pas, on le crée
if [ ! -f "secrets/db_user.txt" ]; then
    echo "app_user" > secrets/db_user.txt
fi

# si le fichier db_name.txt n'existe pas, on le crée
if [ ! -f "secrets/db_name.txt" ]; then
    echo "crazy_charly_db" > secrets/db_name.txt
fi

# si le dossier output_csv n'existe pas, on le crée
if [ ! -d "output_csv" ]; then
    mkdir output_csv
fi

# sie le dossier input_csv n'existe pas, on le crée
if [ ! -d "input_csv" ]; then
    mkdir input_csv
fi

# lancement des containers

# si membre du group docker, on relance le docker-compose
if [ $(id -gn) = "docker" ]; then
    docker-compose up -d
else
    echo "Vous devez être membre du group docker pour lancer le docker-compose"
    echo "Utilisez la commande suivante : sudo usermod -aG docker $USER"
    exit 1
fi