import React, { useEffect, useState, useContext } from 'react';
import { getUserWithProjects, deleteProject } from '@/api/project';
import { AuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import IsLoading from '@/configs/isLoading';
import { motion } from 'framer-motion';

const Projects = () => {
  const { getCurrentUser } = useContext(AuthContext);
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await getUserWithProjects(currentUser.id);
      setProjects(response.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the project!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteProject(currentUser.id, projectId);
        Swal.fire("Deleted!", "The project has been deleted.", "success");
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        Swal.fire("Error", "There was an error deleting the project.", "error");
      }
    }
  };

  const handleUpdate = (projectId) => {
    navigate(`/dashboard/project-details/${projectId}?updated=true`);
  };

  return (
    <>
      {loading ? (
        <IsLoading />
      ) : (
        <motion.div 
          className="p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Projects</h2>
          <div className="overflow-x-auto shadow-xl rounded-2xl">
            <table className="min-w-full bg-white rounded-2xl overflow-hidden">
              <thead className="bg-gradient-to-r from-green-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Title</th>
                  <th className="px-6 py-4 text-left font-semibold">Description</th>
                  <th className="px-6 py-4 text-left font-semibold">Start Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <motion.tr 
                    key={project._id}
                    className="hover:bg-gray-50 transition-all border-t"
                  >
                    <td className="px-6 py-4">{project.title}</td>
                    <td className="px-6 py-4">{project.description}</td>
                    <td className="px-6 py-4">
                      {new Date(project.startDate).toISOString().slice(0, 10)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium
                        ${project.status === 'Not Started'
                          ? 'bg-red-500'
                          : project.status === 'In Progress'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => handleUpdate(project._id)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/project-details/${project._id}`)}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition"
                      >
                        See Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Projects;
