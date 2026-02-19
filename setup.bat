@echo off
:: Script de setup pour les secrets par defauts

:: si le dossier secrets n'existe pas, on le cree
IF NOT EXIST "secrets" (
    mkdir "secrets"
)

:: L'astuce <nul set /p="..." permet d'ecrire dans le fichier SANS le retour a la ligne invisible (\r\n)
:: Cela evite le bug "Access denied" avec les bases de donnees sous Linux/Docker

IF NOT EXIST "secrets\db_password.txt" (
    <nul set /p="password">"secrets\db_password.txt"
)

IF NOT EXIST "secrets\db_root_password.txt" (
    <nul set /p="rootpassword">"secrets\db_root_password.txt"
)

IF NOT EXIST "secrets\db_user.txt" (
    <nul set /p="app_user">"secrets\db_user.txt"
)

IF NOT EXIST "secrets\db_name.txt" (
    <nul set /p="crazy_charly_db">"secrets\db_name.txt"
)

:: si le dossier output_csv n'existe pas, on le cree
IF NOT EXIST "output_csv" (
    mkdir "output_csv"
)

:: si le dossier input_csv n'existe pas, on le cree
IF NOT EXIST "input_csv" (
    mkdir "input_csv"
)

:: Lancement des containers
echo Lancement de docker compose...
docker compose up -d

:: Verification si la commande a echoue
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo Vous devez lancer Docker Desktop avant d'executer ce script, ou vous n'avez pas les droits suffisants.
    exit /b 1
)

echo.
echo Initialisation terminee avec succes !
pause