import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Bilan.css';
import IsLoading from '@/configs/isLoading';
import Swal from 'sweetalert2';

function Bilan() {
  const { projectId } = useParams();
  const [bilan, setBilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ message: '', show: false });
  const [alertMessage, setAlertMessage] = useState(''); // alertMessage for SweetAlert
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (projectId) {
      checkIfBilanExists(projectId);
    } else {
      handleError("Project ID is required.");
      setLoading(false);
    }
  }, [projectId]);

  /****** Export Excel */
  const exportToExcel = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/python/export-bilan-excel/${projectId}`,
        {
          responseType: 'blob',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bilan_${projectId}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Export Excel réussi!',
      });
    } catch (error) {
      handleError(error.response?.data?.error || "Erreur lors de l'export Excel");
    } finally {
      setLoading(false);
    }
  };

  /****** Check if Bilan exists */
  const checkIfBilanExists = async (projectId) => {
    if (!projectId) {
      handleError("Le projectId est manquant");
      return;
    }

    const url = `http://localhost:3001/python/bilan/${projectId}`;

    try {
      const response = await axios.get(url);
      if (response.data.exists) {
        setBilan(response.data.bilanData);
        setLoading(false);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Aucun bilan trouvé',
          text: 'Aucun bilan n\'a été trouvé pour ce projet, un bilan sera généré.',
        });
        setLoading(false);
        fetchBilan();
      }
    } catch (err) {
      handleError('Échec de la vérification de l\'existence du bilan');
      setLoading(false);
    }
  };

  /****** Fetch Bilan */
  const fetchBilan = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/python/generate-bilan?project_id=${projectId}`);
      setBilan(response.data);
      setLoading(false);
      saveBilan(response.data);
    } catch (err) {
      // handleError('Échec du chargement du bilan');
      setLoading(false);
    }
  };

  /****** Save Bilan */
  const saveBilan = async (generatedBilan) => {
    
      const response = await axios.post('http://localhost:3001/python/save-bilan', {
        projectId: projectId,
        bilanData: generatedBilan,
      });
      setAlertMessage('Bilan enregistré avec succès.');
      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Bilan enregistré avec succès.',
      });
    
  };

  /****** Handle Error Alerts */
  const handleError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  };

  /****** Format Values */
  const formatValue = (value) => {
    return isNaN(value) || value === null ? '0.000' : value.toFixed(3);
  };

  /****** Render Table Section */
  const renderTableSection = (sectionData, title) => {
    const renderNestedData = (data, parentCategory = null, isTotalSection = false) => {
      return Object.entries(data).map(([subcategory, items]) => {
        if (parentCategory === subcategory) {
          return null;
        }

        const currentIsTotalSection = subcategory === "TOTAL" || isTotalSection;

        return (
          <React.Fragment key={parentCategory ? `${parentCategory}-${subcategory}` : subcategory}>
            {typeof items === 'object' && !Array.isArray(items) ? (
              <>
                {subcategory !== "TOTAL" && (
                  <tr>
                    <td><strong>{subcategory}</strong></td>
                    <td></td>
                  </tr>
                )}
                {renderNestedData(items, subcategory, currentIsTotalSection)}

                {subcategory === "TOTAL" && !isTotalSection && (
                  <tr>
                    <td><strong>Total</strong></td>
                    <td>{formatValue(items)}</td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td><strong>{subcategory}</strong></td>
                <td>{formatValue(items)}</td>
              </tr>
            )}
          </React.Fragment>
        );
      });
    };

    return (
      <table className="bilan-table">
        <thead>
          <tr>
            <th colSpan="2">{title}</th>
          </tr>
          <tr>
            <th>Catégorie</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {renderNestedData(sectionData)}
        </tbody>
      </table>
    );
  };

  if (loading) return <IsLoading />;

  return (
    <div>
      <h1>Bilan Comptable</h1>

      <div className="bilan-actions">
        <button
          onClick={exportToExcel}
          className="export-excel-btn"
          disabled={loading || !bilan}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              <span>Génération en cours...</span>
            </>
          ) : (
            'Exporter en Excel'
          )}
        </button>
      </div>

      {!error.show && bilan && (
        <div className="bilan-container">
          {bilan.ACTIF && renderTableSection(bilan.ACTIF, 'ACTIF')}
          {bilan.PASSIF && renderTableSection(bilan.PASSIF, 'PASSIF')}
        </div>
      )}
    </div>
  );
}

export default Bilan;
