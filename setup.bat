@echo off
:: Script de setup pour les secrets par defauts

:: setup des secrets par defauts

:: si le dossier secrets n'existe pas, on le cree
IF NOT EXIST "secrets" (
    mkdir "secrets"
)

:: si le fichier db_password.txt n'existe pas, on le cree
:: Attention : il n'y a pas d'espace avant le > pour eviter un espace a la fin du mot de passe
IF NOT EXIST "secrets\db_password.txt" (
    echo password>"secrets\db_password.txt"
)

:: si le fichier db_root_password.txt n'existe pas, on le cree
IF NOT EXIST "secrets\db_root_password.txt" (
    echo rootpassword>"secrets\db_root_password.txt"
)

:: si le fichier db_user.txt n'existe pas, on le cree
IF NOT EXIST "secrets\db_user.txt" (
    echo app_user>"secrets\db_user.txt"
)

:: si le fichier db_name.txt n'existe pas, on le cree
IF NOT EXIST "secrets\db_name.txt" (
    echo crazy_charly_db>"secrets\db_name.txt"
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

echo Lancement de docker-compose...
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
