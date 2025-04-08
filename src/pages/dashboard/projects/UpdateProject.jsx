import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { updateProject, getProjectById } from "@/api/project";
import IsLoading from "@/configs/isLoading";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const UpdateProject = ({ onUpdateSuccess }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await getProjectById(id);
        setFormData(response); 
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleUpdateProject = async () => {
    try {
      setLoading(true);
      await updateProject(id, formData);
      Swal.fire({
        title: "Success!",
        text: "Project updated successfully.",
        confirmButtonColor: "green",
        icon: "success",
      });
      onUpdateSuccess(); 
    } catch (error) {
      console.error("Error updating project:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update project. Please try again.",
        confirmButtonColor: "red",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateProject();
  };

  return (
    <>
      {loading ? (
        <IsLoading />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center min-h-screen"
        >
          <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Update Project
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-purple-600 text-white py-3 px-4 rounded-lg"
              >
                Update Project
              </motion.button>
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default UpdateProject;
