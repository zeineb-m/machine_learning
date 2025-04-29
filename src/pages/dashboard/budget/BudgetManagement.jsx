import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  Input,
  Select,
  Option,
  Spinner,
  Alert,
} from "@material-tailwind/react";
import { CloudArrowUpIcon, ArrowUpTrayIcon, PlusIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { uploadBudgetFile, getBudgetByProject } from "../../../api/budget";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BudgetManagement = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTrimestre, setSelectedTrimestre] = useState(
    Math.ceil((new Date().getMonth() + 1) / 3)
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBudget();
    // Generate array of years (current year - 2 to current year + 3)
    const currentYear = new Date().getFullYear();
    setYears(
      Array.from({ length: 6 }, (_, i) => currentYear - 2 + i)
    );
  }, [projectId]);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching budget for project ID:", projectId);
      const data = await getBudgetByProject(projectId);
      console.log("Budget data received:", data);
      setBudget(data || { items: [] });
    } catch (error) {
      console.error("Error fetching budget:", error);
      setError("Erreur lors du chargement du budget. Veuillez réessayer.");
      setBudget({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSelectFileClick = () => {
    // Trigger the hidden file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const downloadSampleCSV = () => {
    // Create sample CSV content
    const csvContent = `Numero de compte,Categorie,Designation,Montant prevu,Trimestre,Annee
2181,Charges,Achats non stockes,15000,${selectedTrimestre},${selectedYear}
2181,Charges,Achats de marchandises,70000,${selectedTrimestre},${selectedYear}
2181,Charges,Location,30000,${selectedTrimestre},${selectedYear}
2181,Charges,Entretien,18000,${selectedTrimestre},${selectedYear}
2181,Charges,Assurance,55000,${selectedTrimestre},${selectedYear}
2181,Charges,Publicite,10000,${selectedTrimestre},${selectedYear}
2181,Charges,Transports,18000,${selectedTrimestre},${selectedYear}
2181,Charges,Services bancaires,25000,${selectedTrimestre},${selectedYear}
2181,Charges,Charges de personnel,8000,${selectedTrimestre},${selectedYear}
2181,Charges,Charges sociales,22000,${selectedTrimestre},${selectedYear}`;
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `budget_sample_T${selectedTrimestre}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez sélectionner un fichier à importer",
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("project", projectId);

      const response = await uploadBudgetFile(formData);
      
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: `Budget importé avec succès. ${response.itemCount} éléments importés.`,
      });
      
      // Refresh budget data
      fetchBudget();
      setFile(null);
      // Switch to view tab after successful upload
      setActiveTab("view");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur d'importation",
        text: error.response?.data?.message || "Erreur lors de l'importation du budget",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleVarianceAnalysis = () => {
    navigate(`/dashboard/budget-variance/${projectId}/${selectedTrimestre}/${selectedYear}`);
  };

  const renderFilteredBudgetItems = () => {
    if (!budget || !budget.items || budget.items.length === 0) {
      return (
        <Alert color="blue" className="mt-4">
          Aucun élément budgétaire disponible. Veuillez importer des données budgétaires en utilisant l'onglet "Importer un Budget".
        </Alert>
      );
    }

    const filteredItems = budget.items.filter(
      item => item.trimestre === parseInt(selectedTrimestre) && item.annee === parseInt(selectedYear)
    );

    if (filteredItems.length === 0) {
      return (
        <Alert color="amber" className="mt-4">
          Aucun élément budgétaire pour cette période (Trimestre {selectedTrimestre}, {selectedYear}).
          <div className="mt-2">
            <Button 
              color="amber" 
              variant="text" 
              size="sm" 
              onClick={() => setActiveTab("upload")}
              className="normal-case"
            >
              Importer des données pour cette période
            </Button>
            <Button 
              color="amber" 
              variant="text" 
              size="sm" 
              onClick={downloadSampleCSV}
              className="ml-2 normal-case flex items-center gap-1"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Télécharger exemple CSV T{selectedTrimestre} {selectedYear}
            </Button>
          </div>
        </Alert>
      );
    }

    return (
      <div className="overflow-x-auto">
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
                  Catégorie
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
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {item.compte}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {item.categorie}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {item.designation}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.montantPrevu)}
                  </Typography>
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr className="bg-blue-gray-100">
              <td colSpan="3" className="p-4 text-right">
                <Typography variant="small" color="blue-gray" className="font-bold">
                  Total
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-bold">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                    filteredItems.reduce((total, item) => total + item.montantPrevu, 0)
                  )}
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-screen-xl py-8">
      <Card className="w-full shadow-lg">
        <CardHeader
          color="blue"
          className="p-5 flex justify-between items-center"
        >
          <Typography variant="h4" color="white">
            Gestion du Budget
          </Typography>
          {budget && budget.items && budget.items.length > 0 && (
            <Button
              size="sm"
              color="white"
              variant="text"
              onClick={handleVarianceAnalysis}
            >
              Analyse des Écarts Budgétaires
            </Button>
          )}
        </CardHeader>
        <CardBody>
          {error && (
            <Alert color="red" className="mb-4">
              {error}
            </Alert>
          )}
          
          <Tabs value={activeTab} className="mb-6">
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{
                className: "bg-transparent border-b-2 border-blue-500 shadow-none rounded-none",
              }}
            >
              <Tab
                value="view"
                onClick={() => setActiveTab("view")}
                className={activeTab === "view" ? "text-blue-500" : ""}
              >
                Consulter le Budget
              </Tab>
              <Tab
                value="upload"
                onClick={() => setActiveTab("upload")}
                className={activeTab === "upload" ? "text-blue-500" : ""}
              >
                Importer un Budget
              </Tab>
            </TabsHeader>
          </Tabs>

          {activeTab === "upload" && (
            <div className="space-y-6">
              <div className="p-4 border-2 border-dashed border-blue-gray-100 rounded-lg">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <CloudArrowUpIcon className="h-12 w-12 text-blue-500" />
                  <Typography color="blue-gray" className="font-normal text-center">
                    Déposez votre fichier CSV ou cliquez pour sélectionner
                  </Typography>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    id="budget-file"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  
                  {/* Direct button instead of a label */}
                  <Button
                    variant="outlined"
                    color="blue"
                    className="flex items-center gap-3"
                    disabled={uploading}
                    onClick={handleSelectFileClick}
                  >
                    <ArrowUpTrayIcon strokeWidth={2} className="h-5 w-5" />
                    Sélectionner un fichier
                  </Button>
                  
                  {file && (
                    <Typography color="blue-gray" className="font-normal">
                      Fichier sélectionné: {file.name}
                    </Typography>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  color="blue"
                  className="flex items-center gap-3"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <PlusIcon strokeWidth={2} className="h-5 w-5" />
                  )}
                  {uploading ? "Importation en cours..." : "Importer le Budget"}
                </Button>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <Typography variant="small" color="blue-gray">
                  <span className="font-bold">Instructions:</span> Importez un fichier CSV contenant les colonnes suivantes:
                  Numero de compte, Categorie, Designation, Montant prevu, Trimestre, Annee.
                </Typography>
                <div className="mt-2 flex items-center">
                  <Button
                    variant="text"
                    size="sm"
                    color="blue"
                    className="flex items-center gap-2 p-2"
                    onClick={downloadSampleCSV}
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Télécharger un exemple CSV pour T{selectedTrimestre} {selectedYear}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "view" && (
            <div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner color="blue" className="h-8 w-8" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4 items-end">
                    <div>
                      <Typography variant="small" className="mb-2 font-medium">
                        Trimestre
                      </Typography>
                      <Select
                        value={selectedTrimestre.toString()}
                        onChange={(value) => setSelectedTrimestre(parseInt(value))}
                        className="w-40"
                      >
                        <Option value="1">Trimestre 1</Option>
                        <Option value="2">Trimestre 2</Option>
                        <Option value="3">Trimestre 3</Option>
                        <Option value="4">Trimestre 4</Option>
                      </Select>
                    </div>
                    <div>
                      <Typography variant="small" className="mb-2 font-medium">
                        Année
                      </Typography>
                      <Select
                        value={selectedYear.toString()}
                        onChange={(value) => setSelectedYear(parseInt(value))}
                        className="w-40"
                      >
                        {years.map((year) => (
                          <Option key={year} value={year.toString()}>
                            {year}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <Button
                      color="blue"
                      onClick={handleVarianceAnalysis}
                      disabled={!budget || !budget.items || budget.items.length === 0}
                    >
                      Voir l'Analyse des Écarts
                    </Button>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border">
                    {renderFilteredBudgetItems()}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default BudgetManagement; 