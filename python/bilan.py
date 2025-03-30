import pandas as pd
import logging
import requests
from pymongo import MongoClient
from io import StringIO
import json
from tabulate import tabulate
from flask import Flask, jsonify, request
from flask_cors import CORS
from bson import ObjectId
import sys
from tabulate import tabulate
# 🔹 Configuration du logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# 🔹 Connexion à MongoDB
def mongo_connection():
    """
    Établit une connexion à MongoDB et renvoie la base de données.
    """
    try:
        mongo_uri = "mongodb+srv://test:test@cluster0.p9nyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        db = client.get_database('test')
        logging.info("✅ Connexion à MongoDB réussie")
        return db
    except Exception as e:
        logging.error(f"❌ Erreur de connexion à MongoDB: {e}")
        return None

def get_csv_from_mongo(db, project_id):
    """
    Récupère tous les fichiers CSV pour un projet spécifique depuis MongoDB.
    """
    try:
        # Utiliser ObjectId pour convertir le project_id en ObjectId MongoDB
        project_id_object = ObjectId(project_id)
        
        # Query les fichiers correspondant au project_id
        files_docs = db.files.find({"project": project_id_object}, {"_id": 1, "url": 1})  # Filtrer par project_id
        if files_docs:
            data_frames = []
            for file_doc in files_docs:
                if "_id" in file_doc and "url" in file_doc:
                    file_url = f"http://localhost:3001/api/files/{file_doc['_id']}/csv"
                    logging.info(f"📥 Téléchargement du fichier depuis : {file_url}")
                    response = requests.get(file_url)

                    if response.status_code == 200:
                        # Lire les données CSV brutes
                        raw_data = response.text
                        logging.info(f"✅ Fichier {file_doc['_id']} chargé avec succès")
                        
                        # Essayer de traiter la structure imbriquée (si c'est du JSON dans le CSV)
                        try:
                            # Essayer de charger la chaîne comme un format JSON
                            json_data = json.loads(raw_data)
                            df = pd.json_normalize(json_data)
                            logging.info(f"📊 Contenu du fichier {file_doc['_id']} après normalisation :")
                            logging.info(f"\n{df.head()}\n")  # Afficher les premières lignes du DataFrame
                        except json.JSONDecodeError:
                            # Si ce n'est pas un JSON valide, charger comme un CSV régulier
                            df = pd.read_csv(StringIO(raw_data), encoding="utf-8")
                            logging.info(f"📊 Contenu du fichier {file_doc['_id']} :")
                            logging.info(f"\n{df.head()}\n")
                        
                        data_frames.append(df)
                    else:
                        logging.error(f"❌ Erreur HTTP {response.status_code} lors du téléchargement du fichier")
            # Fusionner tous les DataFrames pour combiner les données
            if data_frames:
                final_df = pd.concat(data_frames, ignore_index=True)
                logging.info(f"Extrait des données : \n{df.head()}")

                return final_df
            else:
                logging.error("❌ Aucun fichier CSV trouvé pour ce projet.")
                return None
        else:
            logging.error("❌ Aucun fichier trouvé pour ce projet.")
            return None
    except requests.exceptions.RequestException as e:
        logging.error(f"❌ Erreur de requête HTTP : {e}")
        return None
    except Exception as e:
        logging.error(f"❌ Erreur lors du téléchargement des fichiers CSV : {e}")
        return None


def generate_bilan(df):
    bilan = {
        "ACTIF": {
            "Actif immobilisé": {
                "Immobilisations corporelles": {},
                "Immobilisations incorporelles": {},
                "TOTAL": 0
            },
            "Actif circulant": {
                "Stocks": {},
                "Créances": {},
                "Divers": {},
                "TOTAL": 0
            },
            "TOTAL": 0
        },
        "PASSIF": {
            "Capitaux propres": {},
            "Dettes": {},
            "TOTAL": 0
        }
    }

    mapping = {
        "Immobilisations corporelles": {
            "Batiments": "Batiments",
            "Materiel": "Materiel",
            "Vehicules": "Vehicules",
            "Equipements": "Equipements",
            "Terrains": "Terrains"
        },
        "Immobilisations incorporelles": {
            "Logiciels": "Logiciels",
            "Brevets": "Brevets",
            "Fonds commercial": "Fonds commercial"
        },
        "Stocks": {
            "Stock marchandises": "Stock marchandises",
            "Matieres premieres": "Matieres premieres",
            "Produits finis": "Produits finis"
        },
        "Créances": {
            "Clients": "Créances clients",
            "Autres créances": "Autres créances"
        },
        "Divers": {
            "Loyer": "Loyer",
            "Electricite": "Electricite",
            "Eau": "Eau",
            "Gaz": "Gaz",
            "location": "location",
            "Assurances": "Assurances",
             "Publicite": "Publicite",
             "Transport": "Transport",
            "Charges sociales": "Charges sociales",
            "Charges de personnel": "Charges de personnel",
            "Entretien": "Entretien",
            "Achats non stockes": "Achats non stockes",
            "Internet": "Internet"
        },
        "Capitaux propres": {
            "capital social": "capital social",
            "Reserves": "Reserves"
        },
        "Dettes": {
            "Emprunts": "Emprunts",
            "Fournisseurs": "Dettes fournisseurs",
            "Autres dettes": "Autres dettes"
        }
    }

    if df is not None and not df.empty:
        # Calculer les éléments de l'actif immobilisé
        for category, subcategories in bilan.items():
            total_category = 0
            for subcategory, items in subcategories.items():
                if isinstance(items, dict):
                    total_subcategory_category = 0
                    for subsub, subsub_items in items.items():
                        if subsub in mapping:
                            filtered_items = {}
                            total_subsubcategory = 0
                            if subsub == "Immobilisations corporelles" or subsub == "Immobilisations incorporelles":
                                rows = df[df["Categorie"] == subsub]
                                for item, charge in mapping[subsub].items():
                                    if charge in rows["Designation"].values:
                                        valeur = rows.loc[rows["Designation"] == charge, "Valeur unitaire"]
                                        if not valeur.isna().any():
                                            filtered_items[item] = float(valeur.iloc[0])
                                            total_subsubcategory += filtered_items[item]
                            else:
                                for item, charge in mapping[subsub].items():
                                    if charge in df['Categorie'].values:
                                        valeur = df.loc[df['Designation'] == charge, 'Valeur unitaire']
                                        if not valeur.isna().any():
                                            filtered_items[item] = float(valeur.iloc[0])
                                            total_subsubcategory += filtered_items[item]

                            if filtered_items:
                                bilan[category][subcategory][subsub] = filtered_items
                                total_subcategory_category += total_subsubcategory
                    bilan[category][subcategory]["TOTAL"] = round(total_subcategory_category, 3)
                    total_category += total_subcategory_category
            
            bilan[category]["TOTAL"] = round(total_category, 3)

        # Calculer le total de l'actif circulant
        divers_items = {}
        total_divers = 0
        for item, charge in mapping["Divers"].items():
            # On s'assure que la charge dans "Divers" est bien présente dans la colonne "Charge"
            df_divers = df[df['Categorie'] == charge]
            if not df_divers.empty:
                valeur = df_divers['Total']
                if not valeur.isna().any():
                    divers_items[item] = float(valeur.iloc[0])
                    total_divers += divers_items[item]
                else:
                    print(f"Aucune valeur valide pour {charge} dans la colonne 'Valeur unitaire'.")
            else:
                print(f"Aucune correspondance trouvée pour {charge} dans la colonne 'Charge'.")

        # Mise à jour de l'actif circulant avec les valeurs des divers
        if divers_items:
            bilan["ACTIF"]["Actif circulant"]["Divers"] = divers_items
            bilan["ACTIF"]["Actif circulant"]["Divers"]["TOTAL"] = round(total_divers, 3)

        total_actif_circulant = total_divers  # À ce stade, on n'a que des éléments dans "Divers"
        bilan["ACTIF"]["Actif circulant"]["TOTAL"] = round(total_actif_circulant, 3)

        # Calculer le total de l'actif (actif immobilisé + actif circulant)
        total_actif = bilan["ACTIF"]["Actif immobilisé"]["TOTAL"] + bilan["ACTIF"]["Actif circulant"]["TOTAL"]
        bilan["ACTIF"]["TOTAL"] = round(total_actif, 3)

        # Calcul des dettes
        df_dettes = df[df["Categorie"].str.contains("Dettes", case=False, na=False)]

        dettes_items = {}
        total_dettes = 0

        for index, row in df_dettes.iterrows():
         designation = row["Designation"]
         valeur = row["Total"]  # Prendre "Total" pour bien calculer les dettes

    # Vérifier que la valeur n'est pas NaN avant de la convertir
         if pd.notna(valeur):
          valeur = float(valeur)
         else:
          valeur = 0  # Éviter les erreurs avec les NaN

    # Vérifier si c'est une dette fournisseur ou autre
         if "Fournisseurs" in designation:  # Correction ici (vérifier "Fournisseurs" et non "Dettes fournisseurs")
          if "Fournisseurs" not in dettes_items:
            dettes_items["Fournisseurs"] = 0
          dettes_items["Fournisseurs"] += valeur  # Additionner les dettes fournisseurs
        else:
         if "Autres dettes" not in dettes_items:
            dettes_items["Autres dettes"] = 0
        dettes_items["Autres dettes"] += valeur  # Additionner les autres dettes

        total_dettes += valeur  # Additionner la valeur au total général

# Résultats
        print("Détails des dettes :", dettes_items)
        print("Total des dettes :", total_dettes)

        if dettes_items:
            bilan["PASSIF"]["Dettes"] = dettes_items
            bilan["PASSIF"]["Dettes"]["TOTAL"] = round(total_dettes, 3)

        # Calcul des capitaux propres
        df_capitaux_propres = df[df["Categorie"] == "Capitaux propres"]
        capitaux_propres_items = {}
        total_capitaux_propres = 0

        for index, row in df_capitaux_propres.iterrows():
            designation = row["Designation"]
            valeur = row["Valeur unitaire"]
            if not pd.isna(valeur):
                valeur = float(valeur)
                if designation in mapping["Capitaux propres"]:
                    capitaux_propres_items[designation] = valeur
                    total_capitaux_propres += valeur

        # Calculer le total des capitaux propres après capital social et réserves
        if capitaux_propres_items:
            bilan["PASSIF"]["Capitaux propres"] = capitaux_propres_items
            bilan["PASSIF"]["Capitaux propres"]["TOTAL"] = round(total_capitaux_propres, 3)

        # Calculer le total du passif
        total_passif = total_dettes + total_capitaux_propres
        bilan["PASSIF"]["TOTAL"] = round(total_passif, 3)

    return bilan

from tabulate import tabulate

def display_bilan(bilan):
    """
    Affiche le bilan sous forme de tableau structuré avec des sous-lignes.
    """
    # Convertir la structure du bilan en tableau pour l'affichage
    tableau = []

    # Actif
    actif_table = []
    actif_table.append(["ACTIF", ""])
    
    # Ajouter "Actif immobilisé" en premier
    if "Actif immobilisé" in bilan["ACTIF"]:
        actif_table.append([f"**Actif immobilisé :**", ""])
        for subcategory, items in bilan["ACTIF"]["Actif immobilisé"].items():
            if isinstance(items, dict):
                actif_table.append([f"  {subcategory}", ""])
                for item, value in items.items():
                    actif_table.append([f"    {item}", value if value is not None else 0])
            else:
                actif_table.append([f"  {subcategory}", items if items is not None else 0])
        actif_table.append(["", ""])  # Ligne vide pour la séparation

    # Ajouter "Actif circulant" après
    if "Actif circulant" in bilan["ACTIF"]:
        actif_table.append([f"**Actif circulant :**", ""])
        for subcategory, items in bilan["ACTIF"]["Actif circulant"].items():
            if isinstance(items, dict):
                actif_table.append([f"  {subcategory}", ""])
                for item, value in items.items():
                    actif_table.append([f"    {item}", value if value is not None else 0])
            else:
                actif_table.append([f"  {subcategory}", items if items is not None else 0])
        actif_table.append(["", ""])  # Ligne vide pour la séparation

    # Passif
    passif_table = []
    passif_table.append(["PASSIF", ""])
    
    for subcategory, items in bilan["PASSIF"].items():
        passif_table.append([f"**{subcategory} :**", ""])
        if items is not None:  # Vérifier que items n'est pas None
            for item, value in items.items():
                if isinstance(value, dict):  # Gérer les sous-sous-catégories (comme Dettes à moins d’un an)
                    passif_table.append([f"  {item}", ""])
                    for sub_item, sub_value in value.items():
                        passif_table.append([f"    {sub_item}", sub_value if sub_value is not None else 0])
                else:
                    passif_table.append([f"  {item}", value if value is not None else 0])
        passif_table.append(["", ""])  # Ligne vide pour la séparation

    # Fusionner les deux tableaux horizontalement
    max_rows = max(len(actif_table), len(passif_table))
    for i in range(max_rows):
        # Si la ligne actif_table est plus courte, on rajoute une ligne vide
        actif_row = actif_table[i] if i < len(actif_table) else ["", ""]
        passif_row = passif_table[i] if i < len(passif_table) else ["", ""]
        
        tableau.append([actif_row[0], actif_row[1], passif_row[0], passif_row[1]])

    # Afficher le tableau
    print(tabulate(tableau, headers=["ACTIF", "", "PASSIF", ""], tablefmt="grid"))

    return bilan

# 🔹 Exécuter le script
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Erreur: Project ID est requis.")
        sys.exit(1)

    project_id = sys.argv[1]
    db = mongo_connection()
    if db is not None:
        df = get_csv_from_mongo(db, project_id)
        if df is not None:
            logging.info("📊 Données CSV chargées avec succès.")
            bilan = generate_bilan(df)
            print(json.dumps(bilan, indent=4))
        else:
            logging.error("❌ Le fichier CSV n'a pas pu être chargé.")
    else:
        logging.error("❌ Erreur de connexion à MongoDB.")


# 🔹 Exécuter le serveur Flask
    app = Flask(__name__)
    CORS(app)

    @app.route('/generate-bilan', methods=['GET'])
    def get_bilan():
        project_id = request.args.get("project_id")
        if not project_id:
            return jsonify({"error": "Le project_id est requis"}), 400

        db = mongo_connection()
        if db is not None:
            df = get_csv_from_mongo(db, project_id)
            if df is not None:
                bilan = generate_bilan(df)
                return jsonify(bilan)
            else:
                return jsonify({"error": "Aucun fichier trouvé pour ce projet"}), 404
        else:
            return jsonify({"error": "Erreur de connexion à MongoDB"}), 500

    app.run(host='0.0.0.0', port=5000)

