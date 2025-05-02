import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { updateProject, getProjectById } from "@/api/project";
import IsLoading from "@/configs/isLoading";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FileEdit, X } from "lucide-react";

const UpdateProject = ({ onUpdateSuccess }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    status: "planned",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await getProjectById(id);
        // Format the date for the input field
        const formattedDate = response.startDate 
          ? new Date(response.startDate).toISOString().split('T')[0]
          : "";
        setFormData({
          ...response,
          startDate: formattedDate
        }); 
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
        icon: "success",
        confirmButtonColor: "#4f46e5",
        timer: 1500
      });
      onUpdateSuccess(); 
    } catch (error) {
      console.error("Error updating project:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update project. Please try again.",
        icon: "error",
        confirmButtonColor: "#4f46e5"
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
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FileEdit className="h-5 w-5 mr-2 text-green-600" />
          Edit Project Details
        </h3>
      </div>
      
      <div className="p-6">
        {loading ? (
          <IsLoading />
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onUpdateSuccess}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default UpdateProject;