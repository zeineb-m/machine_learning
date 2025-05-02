import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGrandLivre, saveGrandLivreToDB } from "../../../api/project";
import { Card, Typography, Button, Spinner } from "@material-tailwind/react";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";

const GrandLivre = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [grandLivreData, setGrandLivreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const contentRef = useRef();

  const formatNumber = (value) => {
    if (value === undefined || value === null || value === "") return "0.00";
    const number = parseFloat(value);
    return isNaN(number)
      ? "0.00"
      : number.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    const fetchGrandLivre = async () => {
      try {
        const data = await getGrandLivre(projectId);
        setGrandLivreData(data);
      } catch (error) {
        console.error("Erreur lors du chargement du Grand Livre :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrandLivre();
  }, [projectId]);

  const handleSave = async () => {
    try {
      if (!grandLivreData || grandLivreData.length === 0) {
        alert("❌ No data available to save.");
        return;
      }
      
      setSaving(true);
      
      // Map the data to match the expected schema
      const formattedEntries = grandLivreData.map(entry => ({
        date: entry.date || new Date(),  // Use current date if not provided
        ref: entry.reference || `REF${Math.floor(Math.random() * 1000)}`,
        libelle: entry["Designation"] || "",
        debit: parseFloat(entry["Debit"] || 0),
        credit: parseFloat(entry["Credit"] || 0),
        compte: entry["Numero de compte"] || "",
      }));
      
      const dataToSave = {
        projectId,
        entries: formattedEntries,
      };
      
      await saveGrandLivreToDB(dataToSave);
      alert("✅ Grand Livre saved successfully.");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("❌ Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    const opt = {
      margin:       0.5,
      filename:     `Grand_Livre_Project_${projectId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(contentRef.current).save();
  };

  const groupedData = {};
  let totalDebit = 0;
  let totalCredit = 0;

  grandLivreData.forEach(entry => {
    const accountNumber = entry["Numero de compte"] || "";
    const accountCategory = entry["Categorie"] || "";

    if (!groupedData[accountNumber]) {
      groupedData[accountNumber] = {
        category: accountCategory,
        entries: [],
        totalDebit: 0,
        totalCredit: 0
      };
    }

    const debit = parseFloat(entry["Debit"] || 0);
    const credit = parseFloat(entry["Credit"] || 0);

    groupedData[accountNumber].entries.push(entry);
    groupedData[accountNumber].totalDebit += debit;
    groupedData[accountNumber].totalCredit += credit;

    totalDebit += debit;
    totalCredit += credit;
  });

  return (
    <motion.div className="p-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Typography variant="h3" className="mb-6 text-center text-blue-700 font-bold">
        📖 Grand Livre du Projet
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner color="blue" className="h-12 w-12" />
        </div>
      ) : grandLivreData && grandLivreData.length > 0 ? (
        <>
          <Card className="p-6 shadow-lg border border-gray-200 rounded-2xl" ref={contentRef}>
            <div className="text-center mb-4 text-blue-500 font-bold">
              <Typography variant="h5">Mouvements</Typography>
            </div>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Ref.</th>
                  <th className="px-4 py-2 text-left">Libellé</th>
                  <th className="px-4 py-2 text-right">Débit</th>
                  <th className="px-4 py-2 text-right">Crédit</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedData).map((accountNumber, accountIndex) => {
                  const account = groupedData[accountNumber];
                  return (
                    <React.Fragment key={accountIndex}>
                      <tr className="bg-gray-200">
                        <td colSpan="5" className="px-4 py-2 font-bold text-center">
                          COMPTE {accountNumber}. {account.category}
                        </td>
                      </tr>
                      {account.entries.map((entry, entryIndex) => (
                        <tr key={`${accountIndex}-${entryIndex}`} className="hover:bg-gray-100">
                          <td className="px-4 py-2">{entry.date || "01/01/2024"}</td>
                          <td className="px-4 py-2">{entry.reference || `AC${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`}</td>
                          <td className="px-4 py-2">{entry["Designation"] || ""}</td>
                          <td className="px-4 py-2 text-right">{parseFloat(entry["Debit"]) > 0 ? formatNumber(entry["Debit"]) : "0"}</td>
                          <td className="px-4 py-2 text-right">{parseFloat(entry["Credit"]) > 0 ? formatNumber(entry["Credit"]) : "0"}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-gray-300">
                        <td colSpan="2" className="px-4 py-2"></td>
                        <td className="px-4 py-2 font-medium">Total fin de période</td>
                        <td className="px-4 py-2 text-right font-medium">{formatNumber(account.totalDebit)}</td>
                        <td className="px-4 py-2 text-right font-medium">{formatNumber(account.totalCredit)}</td>
                      </tr>
                      <tr className="border-b border-gray-300 mb-2">
                        <td colSpan="2" className="px-4 py-2"></td>
                        <td className="px-4 py-2 font-medium">Solde fin de période</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {account.totalDebit > account.totalCredit ? formatNumber(account.totalDebit - account.totalCredit) : ""}
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          {account.totalCredit > account.totalDebit ? formatNumber(account.totalCredit - account.totalDebit) : ""}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
                <tr className="bg-blue-50">
                  <td colSpan="2" className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-bold text-blue-500">TOTAL DU GRAND LIVRE</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-500">{formatNumber(totalDebit)}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-500">{formatNumber(totalCredit)}</td>
                </tr>
              </tbody>
            </table>
          </Card>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Button color="blue" onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement..." : "💾 Enregistrer Grand Livre"}
            </Button>
            <Button color="green" onClick={handleDownloadPdf}>
              📄 Télécharger en PDF
            </Button>
            <Button color="gray" onClick={() => navigate(-1)}>
              ⬅ Retour
            </Button>
          </div>
        </>
      ) : (
        <Typography variant="h6" className="text-gray-600 text-center mt-6">
          Aucune donnée disponible pour ce projet.
        </Typography>
      )}
    </motion.div>
  );
};

export default GrandLivre;