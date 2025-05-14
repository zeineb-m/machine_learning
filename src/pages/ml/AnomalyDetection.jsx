import React, { useState, useEffect } from 'react';
import { fetchAnomalyData } from '../../api/anomalyService';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';

const AnomalyDetection = () => {
  const [anomalyData, setAnomalyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState({ x: '', y: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnomalyData();
        setAnomalyData(data);
        const features = Object.keys(data.anomalies[0]).filter(k => k !== 'anomaly_score');
        if (features.length >= 2) {
          setSelectedFeatures({ x: features[0], y: features[1] });
        }
      } catch (err) {
        setError(err.message || 'Error loading anomaly data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getAnomalySeverity = score => score < -0.5 ? 'High' : score < -0.2 ? 'Medium' : 'Low';

  const prepareScatterData = () =>
    anomalyData?.anomalies?.map(a => ({
      x: a[selectedFeatures.x],
      y: a[selectedFeatures.y],
      score: a.anomaly_score,
    })) || [];

  const prepareSeverityData = () => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    anomalyData?.anomalies.forEach(a => counts[getAnomalySeverity(a.anomaly_score)]++);
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  const prepareScoreDistribution = () => {
    const buckets = {};
    anomalyData?.anomalies.forEach(a => {
      const b = (Math.floor(a.anomaly_score / 0.1) * 0.1).toFixed(1);
      buckets[b] = (buckets[b] || 0) + 1;
    });
    return Object.entries(buckets).map(([score, count]) => ({ score: parseFloat(score), count }));
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const features = Object.keys(anomalyData.anomalies[0]).filter(k => k !== 'anomaly_score');
  const scatterData = prepareScatterData();
  const severityData = prepareSeverityData();
  const scoreData = prepareScoreDistribution();

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Anomaly Detection</h2>
      <p>Detected {anomalyData.anomalies.length} anomalies. Threshold: {anomalyData.threshold?.toFixed(4)}</p>

      {/* Dropdowns */}
      <div className="flex gap-4">
        <select value={selectedFeatures.x} onChange={e => setSelectedFeatures(prev => ({ ...prev, x: e.target.value }))}>
          {features.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={selectedFeatures.y} onChange={e => setSelectedFeatures(prev => ({ ...prev, y: e.target.value }))}>
          {features.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Severity Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={severityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scoreData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="score" />
            <YAxis />
            <Tooltip />
            <Line dataKey="count" stroke="#34d399" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name={selectedFeatures.x} />
            <YAxis type="number" dataKey="y" name={selectedFeatures.y} />
            <Tooltip />
            <Scatter name="Anomalies" data={scatterData} fill="#f59e0b" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              {features.map(f => <th key={f} className="p-2 border">{f}</th>)}
              <th className="p-2 border">Anomaly Score</th>
              <th className="p-2 border">Severity</th>
            </tr>
          </thead>
          <tbody>
            {anomalyData.anomalies.slice(0, 50).map((a, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {features.map(f => <td key={f} className="p-2 border">{a[f]}</td>)}
                <td className="p-2 border">{a.anomaly_score.toFixed(4)}</td>
                <td className="p-2 border">{getAnomalySeverity(a.anomaly_score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnomalyDetection;
