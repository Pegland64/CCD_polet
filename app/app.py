import time
import os

print("Démarrage de l'application...")

# Lecture des fichiers dans /input_csv
print("\n--- Lecture des fichiers dans /input_csv ---")
input_dir = "/input_csv"
if os.path.exists(input_dir):
    files = os.listdir(input_dir)
    if files:
        for filename in files:
            filepath = os.path.join(input_dir, filename)
            if os.path.isfile(filepath):
                print(f"📄 Fichier trouvé : {filename}")
                try:
                    with open(filepath, "r") as f:
                        content = f.read()
                        print("Contenu :")
                        print(content)
                except Exception as e:
                    print(f"Erreur lors de la lecture de {filename}: {e}")
    else:
        print("Le dossier /input_csv est vide.")
else:
    print(f"Le dossier {input_dir} n'existe pas.")

#  Écriture dans /output_csv
# 4. Écriture dans /output_csv
print("\n--- Écriture dans /output_csv ---")
output_file = "/output_csv/result.txt"

try:
    with open(output_file, "w") as f_out:
        f_out.write(f"Traitement effectué le {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f_out.write("--------------------------------------------------\n")
        
        # Réécriture du contenu des fichiers d'entrée
        if os.path.exists(input_dir):
            files = os.listdir(input_dir)
            for filename in files:
                filepath = os.path.join(input_dir, filename)
                if os.path.isfile(filepath):
                    f_out.write(f"\n--- Contenu de {filename} ---\n")
                    try:
                        with open(filepath, "r") as f_in:
                            content = f_in.read()
                            f_out.write(content)
                            f_out.write("\n")
                    except Exception as e:
                        f_out.write(f"Erreur lecture {filename}: {e}\n")
        
    print(f"Fichier {output_file} mis à jour avec le contenu des entrées ✅")
except Exception as e:
    print(f"Erreur lors de l'écriture dans {output_file}: {e}")
except Exception as e:
    print(f"Erreur lors de l'écriture dans {output_file}: {e}")
