import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, Grid, Typography, CircularProgress, Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EvaluationSolvabilite = () => {
  const { projectId } = useParams();
  const [ratios, setRatios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatios = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/files/solv/${projectId}`);
        setRatios(response.data?.solvabilite);
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
        console.error("Erreur API :", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchRatios();
    else {
      setError("Project ID est manquant");
      setLoading(false);
    }
  }, [projectId]);

  // Données pour les graphiques
  const ratiosData = {
    labels: ['Endettement', 'Solvabilité', 'Liquidité Générale', 'Autonomie Financière'],
    datasets: [
      {
        label: 'Valeurs des Ratios',
        data: [
          parseFloat(ratios?.ratioEndettement || 0),
          parseFloat(ratios?.ratioSolvabilite || 0),
          parseFloat(ratios?.ratioLiquiditeGenerale || 0),
          parseFloat(ratios?.ratioAutonomieFinanciere || 0)
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const interpretationData = {
    labels: ['Solvable', 'Endettement élevé', 'Liquidité faible', 'Autonomie faible'],
    datasets: [
      {
        data: [
          ratios?.interpretation.solvable ? 1 : 0,
          ratios?.interpretation.endettementEleve ? 1 : 0,
          ratios?.interpretation.liquiditeGeneraleFaible ? 1 : 0,
          ratios?.interpretation.autonomieFinanciereFaible ? 1 : 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        hoverOffset: 4
      }
    ]
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ maxWidth: 500, margin: 'auto', mt: 3, bgcolor: 'error.light' }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Analyse Financière - Projet {projectId}
      </Typography>

      {/* Première ligne avec 2 cartes de même taille */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Carte des ratios principaux */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>Ratios Clés</Typography>
              <Box sx={{ height: '300px' }}>
                <Bar
                  data={ratiosData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)}`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1.5
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Carte d'interprétation */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>Diagnostic Financier</Typography>
              <Box sx={{ height: '300px' }}>
                <Pie
                  data={interpretationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    

      {/* Section d'interprétation détaillée - Une carte pleine largeur */}
      <Grid item xs={12}>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recommandations</Typography>
            {ratios.interpretation.endettementEleve && (
              <Typography paragraph color="error">
                ⚠️ L'endettement est élevé. Il serait prudent de réduire le niveau de dette.
              </Typography>
            )}
            {!ratios.interpretation.solvable && (
              <Typography paragraph color="error">
                ⚠️ La solvabilité est faible. L'entreprise pourrait avoir des difficultés à honorer ses engagements à long terme.
              </Typography>
            )}
            {ratios.interpretation.liquiditeGeneraleFaible && (
              <Typography paragraph color="error">
                ⚠️ La liquidité générale est faible. L'entreprise pourrait avoir des difficultés à faire face à ses obligations à court terme.
              </Typography>
            )}
            {ratios.interpretation.autonomieFinanciereFaible && (
              <Typography paragraph color="error">
                ⚠️ L'autonomie financière est faible. L'entreprise dépend fortement des financements externes.
              </Typography>
            )}
            {ratios.interpretation.solvable && !ratios.interpretation.endettementEleve && (
              <Typography paragraph color="success.main">
                ✅ La situation financière de l'entreprise est saine.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
};

export default EvaluationSolvabilite;