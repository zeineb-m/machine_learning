import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Input } from "@material-tailwind/react";
import { getFiles, deleteFile } from "../../../api/files"; 
import IsLoading from "@/configs/isLoading";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getFiles(); 
        setFiles(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files", error);
      }
    };
    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) =>
    file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteClick = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await deleteFile(fileId);
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
        alert("File deleted successfully!");
      } catch (error) {
        console.error("Error deleting file", error);
        alert("Failed to delete file.");
      }
    }
  };

  return (
    <>
      {loading && <IsLoading />}
      <div className="p-6 bg-white shadow-lg rounded-lg my-5">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="text-gray-900 font-bold">
            Files Management
          </Typography>
          <Button color="green" onClick={() => navigate("/dashboard/bilan")}>See Bilan</Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/3 border border-gray-300 px-4 py-2 rounded-lg"
          />
          <div className="flex space-x-4">
            <Typography variant="h6" className="text-gray-700">
              Total Files: <span className="font-bold">{files.length}</span>
            </Typography>
            <Typography variant="h6" className="text-gray-700">
              Projects: <span className="font-bold">{new Set(files.map(f => f.project)).size}</span>
            </Typography>
          </div>
        </div>

        {filteredFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-sm">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-purple-500 text-white">
                  <th className="px-6 py-3 text-left">File Name</th>
                  <th className="px-6 py-3 text-left">Project ID</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">URL</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map((file, index) => (
                  <tr
                    key={file._id}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition duration-200`}
                  >
                    <td className="px-6 py-4">{file.title}</td>
                    <td className="px-6 py-4">{file.project}</td>
                    <td className="px-6 py-4">{file.description}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{file.url.split("/").pop()}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <Button color="blue" onClick={() => navigate(`/dashboard/files/${file._id}`)}>View</Button>
                      <Button color="purple" onClick={() => navigate(`/dashboard/files/edit/${file._id}`, { state: { file } })}>Edit</Button>
                      <Button color="red" onClick={() => handleDeleteClick(file._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Typography variant="h6" className="text-gray-600 mt-4 text-center">
            No files found.
          </Typography>
        )}

        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(filteredFiles.length / filesPerPage) }, (_, i) => (
            <Button
              key={i + 1}
              variant="outlined"
              color={currentPage === i + 1 ? "primary" : "default"}
              onClick={() => paginate(i + 1)}
              className="mx-1"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Files;