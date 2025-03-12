import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFileCSV } from "../../../api/files"; 
import { Typography } from "@material-tailwind/react";

const FileCSVView = () => {
  const { id } = useParams();
  const [csvData, setCsvData] = useState([]);
  const [stats, setStats] = useState({ totalRows: 0, totalColumns: 0, nonEmptyCells: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFileCSV(id);
        setCsvData(data);
        calculateStats(data);
      } catch (error) {
        console.error("Error fetching CSV data", error);
      }
    };
    fetchData();
  }, [id]);

  const calculateStats = (data) => {
    if (data.length === 0) return;

    const totalRows = data.length;
    const totalColumns = Object.keys(data[0]).length;
    const nonEmptyCells = data.reduce(
      (acc, row) => acc + Object.values(row).filter((cell) => cell !== "").length, 
      0
    );

    setStats({ totalRows, totalColumns, nonEmptyCells });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-5xl">
        <Typography variant="h4" className="mb-6 text-gray-800 font-semibold">
          CSV Data for File: <span className="text-blue-500">{id}</span>
        </Typography>

        {/* Statistics Section */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <Typography variant="h6" className="text-gray-700 font-medium">Total Rows</Typography>
            <p className="text-xl font-semibold text-blue-600">{stats.totalRows}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <Typography variant="h6" className="text-gray-700 font-medium">Total Columns</Typography>
            <p className="text-xl font-semibold text-green-600">{stats.totalColumns}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <Typography variant="h6" className="text-gray-700 font-medium">Non-Empty Cells</Typography>
            <p className="text-xl font-semibold text-yellow-600">{stats.nonEmptyCells}</p>
          </div>
        </div>

        {/* CSV Table */}
        {csvData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
              <thead className="bg-blue-500 text-white">
                <tr>
                  {Object.keys(csvData[0]).map((key, index) => (
                    <th key={index} className="px-4 py-3 text-left font-medium uppercase">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    {Object.keys(row).map((key, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 border-b border-gray-200 text-gray-700">
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Typography variant="h6" className="text-center text-gray-500">
            No data available
          </Typography>
        )}
      </div>
    </div>
  );
};

export default FileCSVView;
