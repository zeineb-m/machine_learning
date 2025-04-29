import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Input } from "@material-tailwind/react";
import { getFiles, deleteFile, getUserWithFiles } from "../../../api/files";
import IsLoading from "@/configs/isLoading";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Swal from "sweetalert2";
import { AuthContext } from '@/context/AuthContext';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const navigate = useNavigate();
  const { getCurrentUser } = useContext(AuthContext);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getUserWithFiles(currentUser.id);
        console.log("Fetched data:", data); // Vérification de la structure des données
        if (data && Array.isArray(data.files)) {
          setFiles(data.files); // On récupère uniquement le tableau de fichiers
        } else {
          console.error("Expected 'files' to be an array, but got:", data);
          setFiles([]); // Si aucun fichier, on assigne un tableau vide
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files", error);
        setLoading(false);
      }
    };

    fetchFiles();
  }, [currentUser.id]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Votre navigateur ne supporte pas la reconnaissance vocale.");
    }
  }, []);

  useEffect(() => {
    setSearchQuery(transcript.replace(/\.$/, ""));
  }, [transcript]);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: false, language: "fr-FR" });
  };

  // Filtrer les fichiers uniquement si files est un tableau
  const filteredFiles = Array.isArray(files) ? files.filter((file) =>
    file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        await deleteFile(id);
        setFiles((prev) => prev.filter((file) => file._id !== id));
        Swal.fire("Deleted!", "Your file has been deleted.", "success", {
          confirmButtonColor: "green",
        });
      } catch (error) {
        console.error("Error deleting file:", error);
        Swal.fire("Error", "There was a problem deleting the file.", "error");
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
          
          <Button color="green" onClick={startListening}>
            🎤
          </Button>
        </div>

        {!browserSupportsSpeechRecognition && (
          <Typography className="text-red-500">🚨 Votre navigateur ne supporte pas la reconnaissance vocale.</Typography>
        )}

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
                {filteredFiles.map((file, index) => (
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
                      <Button color="red" onClick={() => handleDelete(file._id)}>Delete</Button>
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
      </div>
    </>
  );
};

export default Files;
