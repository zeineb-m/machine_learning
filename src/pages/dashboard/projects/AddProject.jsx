import React, { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { addNewProject } from "@/api/project";
import IsLoading from "@/configs/isLoading";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; 

const AddProject = () => {
  const [loading, setLoading] = useState(false);
  const { getCurrentUser } = useContext(AuthContext);
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    status: "planned",
    user_id: currentUser.id,
  });

  const handleAddNewProject = async () => {
    try {
      setLoading(true);
      const newProject = await addNewProject(formData);
      Swal.fire({
        title: "Good job!",
        text: newProject.message,
        icon: "success",
      });
      setFormData({
        title: "",
        description: "",
        startDate: "",
        status: "planned",
        user_id: currentUser.id,
      });
    } catch (error) {
      console.log({ error: error });
      Swal.fire({
        title: "Error!",
        text: "Failed to add project. Please try again.",
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
    handleAddNewProject();
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
          className="flex justify-center items-center min-h-screen "
        >
          <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl transform transition-all">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Add New Project
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
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }} 
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-purple-600 text-white py-3 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-green-700 transition-all"
              >
                Add Project
              </motion.button>
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AddProject;