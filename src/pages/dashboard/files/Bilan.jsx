import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Bilan.css';
import IsLoading from '@/configs/isLoading';

function Bilan() {
  const { projectId } = useParams();
  const [bilan, setBilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchBilan(projectId);
    } else {
      setError("Project ID is required.");
      setLoading(false);
    }
  }, [projectId]);
  const fetchBilan = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:3001/python/generate-bilan?project_id=${projectId}`);
      console.log(response.data); // Ajouter cette ligne pour inspecter la réponse
      setBilan(response.data);
      setShowError(!response.data || (!response.data.ACTIF && !response.data.PASSIF)); 
      setLoading(false);
    } catch (err) {
      console.error(err); // Ajouter cette ligne pour inspecter l'erreur
      setError(err.response ? err.response.data : 'Failed to load bilan');
      setShowError(true);
      setLoading(false);
    }
  };
  
  const formatValue = (value) => {
    return isNaN(value) || value === null ? '0.000' : value.toFixed(3);
  };

  if (loading) return <IsLoading />;

  return (
    <div>
      <h1>Bilan Comptable</h1>

      {showError && (
        <>
          <div className="error-overlay" onClick={() => setShowError(false)}></div>
          <div className="error-message">
            <p>Aucun fichier n'a été trouvé pour ce projet.</p>
            <p>Veuillez ajouter les fichiers nécessaires avant de consulter le bilan.</p>
            <button onClick={() => setShowError(false)}>Fermer</button>
          </div>
        </>
      )}

      {!showError && bilan && (
        <div className="bilan-container">
          {/* Affichage de la section ACTIF */}
          <table className="bilan-table">
            <thead>
              <tr>
                <th colSpan="2">ACTIF</th>
              </tr>
              <tr>
                <th>Catégorie</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {bilan.ACTIF && (
                <>
                  {/* Actif Immobilisé */}
                  {bilan.ACTIF['Actif immobilisé'] && (
                    <>
                      <tr>
                        <td colSpan="2" className="category-title"><strong>Actif Immobilisé</strong></td>
                      </tr>
                      {Object.entries(bilan.ACTIF['Actif immobilisé']).map(([subcategory, items]) => (
                        <React.Fragment key={subcategory}>
                          {subcategory !== "TOTAL" && (
                            <tr>
                              <td><strong>{subcategory}</strong></td>
                              <td></td>
                            </tr>
                          )}
                          {typeof items === 'object' && Object.entries(items).map(([item, value]) => (
                            <tr key={item}>
                              <td>{item}</td>
                              <td>{formatValue(value)}</td>
                            </tr>
                          ))}
                          {subcategory === "TOTAL" && (
                            <tr>
                              <td><strong>Total I</strong></td>
                              <td>{formatValue(items)}</td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}

                  {/* Actif Circulant */}
                  {bilan.ACTIF['Actif circulant'] && (
                    <>
                      <tr>
                        <td colSpan="2" className="category-title"><strong>Actif Circulant</strong></td>
                      </tr>
                      {Object.entries(bilan.ACTIF['Actif circulant']).map(([subcategory, items]) => (
                        <React.Fragment key={subcategory}>
                          {subcategory !== "TOTAL" && (
                            <tr>
                              <td><strong>{subcategory}</strong></td>
                              <td></td>
                            </tr>
                          )}
                          {typeof items === 'object' && Object.entries(items).map(([item, value]) => (
                            <tr key={item}>
                              <td>{item}</td>
                              <td>{formatValue(value)}</td>
                            </tr>
                          ))}
                          {subcategory === "TOTAL" && (
                            <tr>
                              <td><strong>Total II</strong></td>
                              <td>{formatValue(items)}</td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}

                  {/* Total ACTIF */}
                  <tr>
                    <td><strong>Total ACTIF</strong></td>
                    <td>{formatValue(bilan.ACTIF.TOTAL)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* Affichage de la section PASSIF */}
          <table className="bilan-table">
            <thead>
              <tr>
                <th colSpan="2" className="category-title">PASSIF</th>
              </tr>
              <tr>
                <th>Catégorie</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
            {bilan.PASSIF && (
  <>
    {bilan.PASSIF["Capitaux propres"] && (
      <>
        <tr key="Capitaux propres">
        <td colSpan="2" className="category-title"><strong>Capitaux propres</strong></td>
        </tr>
        {bilan.PASSIF["Capitaux propres"]["capital social"] && (
          <tr>
            <td>capital social</td>
            <td>{formatValue(bilan.PASSIF["Capitaux propres"]["capital social"])}</td>
          </tr>
        )}
        {bilan.PASSIF["Capitaux propres"]["Reserves"] && (
          <tr>
            <td>Reserves</td>
            <td>{formatValue(bilan.PASSIF["Capitaux propres"]["Reserves"])}</td>
          </tr>
        )}
        {bilan.PASSIF["Capitaux propres"]["TOTAL"] && (
          <tr>
            <td><strong>TOTAL</strong></td>
            <td><strong>{formatValue(bilan.PASSIF["Capitaux propres"]["TOTAL"])}</strong></td>
          </tr>
        )}
      </>
    )}

    {/* Autres sections de PASSIF */}
    {Object.entries(bilan.PASSIF).map(([category, items]) => (
      category !== "Capitaux propres" && category !== "TOTAL" && (
        <>
          <tr key={category}>
            <td colSpan="2"><strong>{category}</strong></td>
          </tr>
          {typeof items === "object" && Object.entries(items).map(([item, value]) => (
            <tr key={item}>
              <td>{item}</td>
              <td>{formatValue(value)}</td>
            </tr>
          ))}
        </>
      )
    ))}

    {/* Total PASSIF */}
    <tr>
      <td><strong>Total PASSIF</strong></td>
      <td>{formatValue(bilan.PASSIF.TOTAL)}</td>
    </tr>
  </>
)}

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Bilan;
