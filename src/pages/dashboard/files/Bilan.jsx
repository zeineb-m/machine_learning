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
      const response = await axios.get(`http://localhost:5000/generate-bilan?project_id=${projectId}`);
      setBilan(response.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response ? err.response.data : 'Failed to load bilan';
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (loading) return <IsLoading />;
  if (error) return <div>{error}</div>;

  return (
    <div>
    <h1>Bilan Comptable</h1>

    <div className="bilan-container">
        {/* Tableau ACTIF */}
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
                {bilan && bilan.ACTIF ? (
                    Object.entries(bilan.ACTIF).map(([category, items]) => (
                        <React.Fragment key={category}>
                            <tr>
                                <td colSpan="2"><strong>{category}</strong></td>
                            </tr>
                            {items && Object.entries(items).map(([item, value]) => (
                                <tr key={item}>
                                    <td>{item}</td>
                                    <td>
                                        {typeof value === 'object' && value !== null ? (
                                            <ul>
                                                {Object.entries(value).map(([subItem, subValue]) => (
                                                    <li key={subItem}>
                                                        {subItem}: {subValue}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            value // Afficher la valeur directement si ce n'est pas un objet
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2">Aucune donnée disponible</td>
                    </tr>
                )}
            </tbody>
        </table>

        {/* Tableau PASSIF */}
        <table className="bilan-table">
            <thead>
                <tr>
                    <th colSpan="2">PASSIF</th>
                </tr>
                <tr>
                    <th>Catégorie</th>
                    <th>Montant</th>
                </tr>
            </thead>
            <tbody>
                {bilan && bilan.PASSIF ? (
                    Object.entries(bilan.PASSIF).map(([category, items]) => (
                        <React.Fragment key={category}>
                            <tr>
                                <td colSpan="2"><strong>{category}</strong></td>
                            </tr>
                            {items && Object.entries(items).map(([item, value]) => (
                                <tr key={item}>
                                    <td>{item}</td>
                                    <td>
                                        {typeof value === 'object' && value !== null ? (
                                            <ul>
                                                {Object.entries(value).map(([subItem, subValue]) => (
                                                    <li key={subItem}>
                                                        {subItem}: {subValue}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            value // Afficher la valeur directement si ce n'est pas un objet
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2">Aucune donnée disponible</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
</div>
);
};

export default Bilan;