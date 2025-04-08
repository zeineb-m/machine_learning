import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGrandLivre } from "../../../api/project"; 
import { Card, Typography, Button, Spinner } from "@material-tailwind/react";
import { motion } from "framer-motion";

const GrandLivre = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [grandLivreData, setGrandLivreData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility function to safely format numbers
  const formatNumber = (value) => {
    if (value === undefined || value === null || value === "") return "0.00";
    const number = parseFloat(value);
    return isNaN(number) ? "0.00" : number.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  };

  useEffect(() => {
    const fetchGrandLivre = async () => {
      try {
        const data = await getGrandLivre(projectId);
        console.log("Data received from API:", data);
        setGrandLivreData(data); 
      } catch (error) {
        console.error("Erreur lors du chargement du Grand Livre :", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchGrandLivre();
  }, [projectId]);
  
  
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
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h3" className="mb-6 text-center text-blue-700 font-bold">
        📖 Grand Livre du Projet
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner color="blue" className="h-12 w-12" />
        </div>
      ) : grandLivreData && grandLivreData.length > 0 ? (
        <Card className="p-6 shadow-lg border border-gray-200 rounded-2xl">
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
                    {/* Account header */}
                    <tr className="bg-gray-200">
                      <td colSpan="5" className="px-4 py-2 font-bold text-center">
                        COMPTE {accountNumber}. {account.category}
                      </td>
                    </tr>
                    
                    {/* Account entries */}
                    {account.entries.map((entry, entryIndex) => (
                      <tr key={`${accountIndex}-${entryIndex}`} className="hover:bg-gray-100">
                        <td className="px-4 py-2">
                          {entry.date || "01/01/2024"}
                        </td>
                        <td className="px-4 py-2">
                          {entry.reference || `AC${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`}
                        </td>
                        <td className="px-4 py-2">
                          {entry["Designation"] || ""}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {parseFloat(entry["Debit"]) > 0 ? formatNumber(entry["Debit"]) : ""}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {parseFloat(entry["Credit"]) > 0 ? formatNumber(entry["Credit"]) : ""}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Account totals */}
                    <tr className="border-t border-gray-300">
                      <td colSpan="2" className="px-4 py-2"></td>
                      <td className="px-4 py-2 font-medium">Total fin de période</td>
                      <td className="px-4 py-2 text-right font-medium">
                        {formatNumber(account.totalDebit)}
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {formatNumber(account.totalCredit)}
                      </td>
                    </tr>
                    
                    {/* Account balance */}
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
              
              {/* Grand total */}
              <tr className="bg-blue-50">
                <td colSpan="2" className="px-4 py-3"></td>
                <td className="px-4 py-3 font-bold text-blue-500">TOTAL DU GRAND LIVRE</td>
                <td className="px-4 py-3 text-right font-bold text-blue-500">
                  {formatNumber(totalDebit)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-blue-500">
                  {formatNumber(totalCredit)}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      ) : (
        <Typography variant="h6" className="text-gray-600 text-center mt-6">
          Aucune donnée disponible pour ce projet.
        </Typography>
      )}

      <div className="mt-6 flex justify-center">
        <Button color="blue" onClick={() => navigate(-1)} className="px-6 py-3">
          ⬅ Retour
        </Button>
      </div>
    </motion.div>
  );
};

export default GrandLivre;