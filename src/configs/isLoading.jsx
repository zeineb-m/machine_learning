import React, { useState, useEffect } from 'react';

const IsLoading = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-75">
      <div className="flex flex-col items-center p-4 bg-gray-900 rounded-md shadow-lg border-2 border-gray-700">
        <div className="mb-3 w-28 h-8 bg-green-200 text-gray-800 text-lg font-mono text-center flex items-center justify-center rounded-md shadow-inner border border-gray-600">
          LOAD{dots}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <div
              key={num}
              className="w-8 h-8 bg-gray-700 text-white text-sm flex items-center justify-center rounded shadow-md transition duration-300 transform hover:scale-105 hover:bg-gray-600"
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IsLoading;
