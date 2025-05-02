import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCashFlowPrediction } from "@/api/project";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const CashFlowPrediction = () => {
  const { projectId } = useParams();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const data = await getCashFlowPrediction(projectId);
        setPrediction(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch cash flow prediction:", err);
        setError("Failed to load cash flow prediction. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [projectId]);

  // Format the prediction data for the chart
  const formatChartData = () => {
    if (!prediction || !prediction.aiForecast) return [];

    // Start with the current month's data
    const chartData = [
      {
        name: "Current",
        cashFlow: prediction.currentLiquidity,
      },
    ];

    // Add the AI forecasts
    prediction.aiForecast.forEach((forecast) => {
      const date = new Date(forecast.ds);
      const month = date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
      
      chartData.push({
        name: month,
        cashFlow: Math.round(forecast.yhat),
      });
    });

    return chartData;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12 text-blue-500/10" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-4 shadow-md mb-6">
        <div className="flex items-center text-red-500 mb-4">
          <ExclamationTriangleIcon className="h-8 w-8 mr-2" />
          <Typography variant="h5">Error Loading Prediction</Typography>
        </div>
        <Typography>{error}</Typography>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <Typography variant="h3" className="mb-2">
          Cash Flow Prediction
        </Typography>
        <Typography className="text-gray-600">
          AI-powered cash flow forecasting for your project over the next 3 months.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Liquidity Card */}
        <Card className="shadow-lg">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography className="text-blue-gray-600 text-sm font-semibold mb-3">
                  CURRENT LIQUIDITY
                </Typography>
                <Typography variant="h4" className="font-bold">
                  {prediction?.currentLiquidity?.toLocaleString()} TND
                </Typography>
              </div>
              <div className="rounded-full bg-blue-500/10 p-3">
                <BanknotesIcon className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Cash In Card */}
        <Card className="shadow-lg">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography className="text-blue-gray-600 text-sm font-semibold mb-3">
                  CASH IN
                </Typography>
                <Typography variant="h4" className="font-bold">
                  {prediction?.cashIn?.toLocaleString()} TND
                </Typography>
              </div>
              <div className="rounded-full bg-green-500/10 p-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Cash Out Card */}
        <Card className="shadow-lg">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography className="text-blue-gray-600 text-sm font-semibold mb-3">
                  CASH OUT
                </Typography>
                <Typography variant="h4" className="font-bold">
                  {prediction?.cashOut?.toLocaleString()} TND
                </Typography>
              </div>
              <div className="rounded-full bg-red-500/10 p-3">
                <ArrowTrendingDownIcon className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Chart Card */}
      <Card className="shadow-lg mb-8">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center p-6"
        >
          <div>
            <Typography variant="h5" color="blue-gray">
              3-Month Cash Flow Forecast
            </Typography>
            <Typography
              color="gray"
              className="mt-1 font-normal"
            >
              Predicted using historical transaction data and AI
            </Typography>
          </div>
        </CardHeader>

        <CardBody className="px-2 pb-6">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formatChartData()}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()} TND`, "Cash Flow"]}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cashFlow"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Detailed Forecast */}
      <Card className="shadow-lg mb-8">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="p-6"
        >
          <Typography variant="h5" color="blue-gray">
            Detailed Forecast Data
          </Typography>
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Period", "Predicted Cash Flow", "Change"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-6 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-medium uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-6 border-b border-blue-gray-50">
                  <Typography className="text-sm font-semibold">
                    Current
                  </Typography>
                </td>
                <td className="py-3 px-6 border-b border-blue-gray-50">
                  <Typography className="text-sm font-semibold">
                    {prediction?.currentLiquidity?.toLocaleString()} €
                  </Typography>
                </td>
                <td className="py-3 px-6 border-b border-blue-gray-50">
                  <Typography className="text-sm font-semibold">
                    -
                  </Typography>
                </td>
              </tr>
              {prediction?.aiForecast?.map((forecast, index) => {
                const date = new Date(forecast.ds);
                const month = date.toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                });
                
                const value = Math.round(forecast.yhat);
                const prevValue = index === 0 
                  ? prediction.currentLiquidity 
                  : Math.round(prediction.aiForecast[index - 1].yhat);
                
                const change = value - prevValue;
                const changePercent = (change / prevValue) * 100;

                return (
                  <tr key={forecast.ds}>
                    <td className="py-3 px-6 border-b border-blue-gray-50">
                      <Typography className="text-sm font-semibold">
                        {month}
                      </Typography>
                    </td>
                    <td className="py-3 px-6 border-b border-blue-gray-50">
                      <Typography className="text-sm font-semibold">
                        {value.toLocaleString()} €
                      </Typography>
                    </td>
                    <td className="py-3 px-6 border-b border-blue-gray-50">
                      <Typography
                        className={`text-sm font-semibold flex items-center ${
                          change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {change >= 0 ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {change.toLocaleString()} € ({changePercent.toFixed(2)}%)
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Conclusion Card */}
      <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardBody className="p-6">
          <Typography variant="h5" className="mb-4">
            Cash Flow Analysis
          </Typography>
          
          {prediction?.aiForecast?.length > 0 && (
            <Typography className="mb-4">
              Based on your historical data, your cash flow is predicted to 
              {prediction.aiForecast[prediction.aiForecast.length - 1].yhat > prediction.currentLiquidity
                ? " increase over the next 3 months. This positive trend suggests good financial health."
                : " decrease over the next 3 months. You may want to take measures to improve cash inflow."}
            </Typography>
          )}
          
          <Typography>
            Net cash flow in the current period: <strong>{prediction?.netFlow?.toLocaleString()} TND</strong>
          </Typography>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default CashFlowPrediction;