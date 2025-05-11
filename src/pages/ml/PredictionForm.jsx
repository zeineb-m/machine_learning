import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";  // Importation de SweetAlert2

const PredictForm = () => {
  const [formData, setFormData] = useState({
    "Control-Data-Type": "", // Ajouter les autres features ici si nécessaire
  });
  const [prediction, setPrediction] = useState(null);
  const [meaning, setMeaning] = useState(null);  // Nouveau state pour la signification
  const [transactionCodes, setTransactionCodes] = useState({});

  // Récupérer le mappage des codes de transaction
  useEffect(() => {
    const fetchTransactionCodes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/transaction-codes");
        setTransactionCodes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des codes de transaction :", error);
      }
    };

    fetchTransactionCodes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const featureArray = Object.values(formData).map(Number);

    try {
      const response = await axios.post("http://localhost:5000/predict", {
        features: featureArray,
      });
      setPrediction(response.data.prediction);  // Mise à jour du code de transaction prédit
      setMeaning(response.data.meaning);  // Mise à jour de la signification de la transaction

      // Affichage de l'alerte avec SweetAlert2
      Swal.fire({
        title: "Prédiction réussie",
        text: `Code de transaction prédit : ${response.data.prediction}\nSignification : ${response.data.meaning}`,
        icon: "success",
        confirmButtonText: "OK",
        // background: "#28a745", // Fond vert
        color: "#28a745",  // Texte en blanc
        confirmButtonColor: "#28a745", // Couleur du bouton
      });
    } catch (error) {
      console.error("Erreur lors de la prédiction :", error);

      // Affichage d'une alerte en cas d'erreur
      Swal.fire({
        title: "Erreur",
        text: "Une erreur s'est produite lors de la prédiction.",
        icon: "error",
        
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Control-Data-Type:
          <input
            type="number"
            name="Control-Data-Type"
            value={formData["Control-Data-Type"]}
            onChange={handleChange}
            className="mt-1 p-2 border w-full rounded"
            required
          />
        </label>

        {/* Ajoute d'autres inputs ici si tu as plusieurs features */}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Prédire
        </button>
      </form>

      {/* Pas nécessaire de gérer l'affichage ici car SweetAlert2 prend en charge l'affichage */}
    </div>
  );
};

export default PredictForm;
