import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBalance, addBalance } from '@/api/balance';
import IsLoading from '@/configs/isLoading';

const Balance = () => {
  const { projectId } = useParams();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrCreateBalance = async () => {
      try {
        const result = await getBalance(projectId);
        setBalance(result.balance);
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            const created = await addBalance(projectId); 
            setBalance(created.balance);
          } catch (creationError) {
            setError("Failed to create balance: " + creationError.message);
          }
        } else {
          setError("Failed to fetch balance: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateBalance();
  }, [projectId]);

  if (loading) return (
   <IsLoading />
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-green-600 to-purple-700 text-white">
          <h2 className="text-2xl font-bold">Balance Générale</h2>
          <p className="opacity-90">Project ID: {projectId}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compte
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Débit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crédit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solde Débiteur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solde Créditeur
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {balance.lines.map((line, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {line.compte}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800">
                      {line.totalDebit.toFixed(3)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800">
                      {line.totalCredit.toFixed(3)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {line.soldeDebiteur.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {line.soldeCrediteur.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {balance.lines.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{balance.lines.length}</span> entries
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;