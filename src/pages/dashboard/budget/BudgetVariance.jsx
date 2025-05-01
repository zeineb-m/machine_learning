import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Spinner,
  Progress,
  Alert,
  Input,
} from "@material-tailwind/react";
import {
  DocumentArrowDownIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { useParams, useNavigate } from "react-router-dom";
import {
  generateBudgetVariance,
  getBudgetVarianceByProject,
  exportBudgetVarianceToExcel,
} from "../../../api/budget";
import Swal from "sweetalert2";

const BudgetVariance = () => {
  const { projectId, trimestre, annee } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [budgetVariance, setBudgetVariance] = useState(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  useEffect(() => {
    fetchBudgetVariance();
  }, [projectId, trimestre, annee]);

  const fetchBudgetVariance = async () => {
    try {
      setLoading(true);
      const data = await getBudgetVarianceByProject(projectId, trimestre, annee);
      setBudgetVariance(data);
      
      // If we have existing date ranges, populate the form fields
      if (data && data.dateDebut && data.dateFin) {
        setDateDebut(new Date(data.dateDebut).toISOString().split('T')[0]);
        setDateFin(new Date(data.dateFin).toISOString().split('T')[0]);
      } else {
        // Set default date range to current quarter
        const year = parseInt(annee);
        const quarter = parseInt(trimestre);
        const quarterStart = new Date(year, (quarter - 1) * 3, 1);
        const quarterEnd = new Date(year, quarter * 3, 0);
        setDateDebut(quarterStart.toISOString().split('T')[0]);
        setDateFin(quarterEnd.toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error("Error fetching budget variance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVariance = async () => {
    try {
      setGenerating(true);
      const response = await generateBudgetVariance({
        projectId,
        trimestre,
        annee,
        dateDebut,
        dateFin,
      });
      
      setBudgetVariance(response.budgetVariance);
      
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Analyse des écarts budgétaires générée avec succès.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.message || "Erreur lors de la génération de l'analyse des écarts budgétaires.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleExportExcel = () => {
    if (budgetVariance && budgetVariance._id) {
      exportBudgetVarianceToExcel(budgetVariance._id);
    }
  };

  const getVarianceColor = (ecart, montantPrevu) => {
    const percentage = montantPrevu !== 0 ? (ecart / montantPrevu) * 100 : 0;
    if (percentage <= -5) return "green";
    if (percentage > -5 && percentage < 5) return "blue";
    
    return "red";
  };

  const getProgressBarColor = (ecart, montantPrevu) => {
    const percentage = montantPrevu !== 0 ? (ecart / montantPrevu) * 100 : 0;
    if (percentage <= -5) return "green";
    if (percentage > -5 && percentage < 5) return "blue";
    return "red";
  };

  const getProgressPercentage = (montantReel, montantPrevu) => {
    if (montantPrevu === 0) return 0;
    return Math.min(Math.max((montantReel / montantPrevu) * 100, 0), 150);
  };

  return (
    <div className="mx-auto max-w-screen-xl py-8">
      <Card className="w-full shadow-lg">
        <CardHeader
          color="blue"
          className="p-5 flex justify-between items-center"
        >
          <Typography variant="h4" color="white">
            Suivi des Écarts Budgétaires
          </Typography>
          <div className="flex gap-2">
            <Button
              size="sm"
              color="white"
              variant="text"
              onClick={() => navigate(`/dashboard/budget/${projectId}`)}
            >
              Retour au Budget
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <Typography color="blue" className="font-medium">
              Analyse du trimestre {trimestre} de l'année {annee}
            </Typography>
            <Typography variant="small" color="blue-gray">
              Cette analyse compare les soldes réels du Grand Livre avec les prévisions budgétaires
              pour identifier les écarts significatifs et ajuster la stratégie budgétaire.
            </Typography>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Date de début
              </Typography>
              <Input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                label="Date de début"
              />
            </div>
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Date de fin
              </Typography>
              <Input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                label="Date de fin"
              />
            </div>
          </div>

          <div className="mb-6 flex justify-center gap-4">
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={handleGenerateVariance}
              disabled={generating || !dateDebut || !dateFin}
            >
              {generating ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <ArrowPathIcon className="h-4 w-4" />
              )}
              {generating ? "Génération en cours..." : "Générer l'Analyse"}
            </Button>
            
            {budgetVariance && (
              <Button
                color="green"
                className="flex items-center gap-2"
                onClick={handleExportExcel}
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                Exporter en Excel
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner color="blue" className="h-8 w-8" />
            </div>
          ) : !budgetVariance ? (
            <Alert color="blue" className="mb-6">
              Aucune analyse d'écarts budgétaires n'a été générée pour cette période. Veuillez cliquer sur "Générer l'Analyse".
            </Alert>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="shadow-sm">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Typography variant="h6" color="blue-gray">
                        Budget Total
                      </Typography>
                      <ArrowsRightLeftIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <Typography variant="h4" color="blue">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budgetVariance.totalPrevu)}
                    </Typography>
                  </CardBody>
                </Card>            
                <Card className="shadow-sm">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Typography variant="h6" color="blue-gray">
                        Réalisation
                      </Typography>
                      <ChartBarIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <Typography variant="h4" color="green">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budgetVariance.totalReel)}
                    </Typography>
                  </CardBody>
                </Card>
                
                <Card className="shadow-sm">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Typography variant="h6" color="blue-gray">
                        Écart Total
                      </Typography>
                      <Typography variant="h6" color={getVarianceColor(budgetVariance.ecartTotal, budgetVariance.totalPrevu)}>
                        {budgetVariance.ecartPourcentageTotal.toFixed(2)}%
                      </Typography>
                    </div>
                    <Typography 
                      variant="h4" 
                      color={getVarianceColor(budgetVariance.ecartTotal, budgetVariance.totalPrevu)}
                    >
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budgetVariance.ecartTotal)}
                    </Typography>
                  </CardBody>
                </Card>
              </div>

              <div className="bg-white rounded-lg shadow-sm border">
                <table className="w-full min-w-[800px] table-auto">
                  <thead>
                    <tr>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          Compte
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          Désignation
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          Montant Prévu
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          Montant Réel
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          Écart
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-left">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          % Réalisation
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetVariance.items.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {item.compte}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {item.designation}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                              {item.categorie}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.montantPrevu)}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.montantReel)}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Typography 
                              variant="small"
                              color={getVarianceColor(item.ecart, item.montantPrevu)} 
                              className="font-medium"
                            >
                              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.ecart)}
                            </Typography>
                            <Typography
                              variant="small"
                              color={getVarianceColor(item.ecart, item.montantPrevu)}
                              className="text-xs font-bold"
                            >
                              ({item.ecartPourcentage.toFixed(1)}%)
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="w-full">
                            <div className="mb-1 flex items-center justify-between gap-4">
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {getProgressPercentage(item.montantReel, item.montantPrevu).toFixed(1)}%
                              </Typography>
                            </div>
                            <Progress
                              value={getProgressPercentage(item.montantReel, item.montantPrevu)}
                              size="sm"
                              color={getProgressBarColor(item.ecart, item.montantPrevu)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default BudgetVariance; 