import React, { useEffect, useState, useContext } from "react";
import ProjectCards from "./cards/ProjectCards";
import { getProjectById, deleteProject } from "@/api/project";
import { addUserToProject, removeUserFromProject, getUsersByProjectId } from "@/api/project";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import IsLoading from "@/configs/isLoading";
import UpdateProject from "../UpdateProject";
import { AuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { getAllUsers } from "@/api/users";
import { FileEdit, Trash2, Plus, X, Users, Calendar, Info } from "lucide-react";

const ProjectDetails = () => {
  const { getCurrentUser } = useContext(AuthContext);
  const user = getCurrentUser();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [update, setUpdate] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [projectUsers, setProjectUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const updated = searchParams.get("updated") === "true"; 

  const fetchData = async () => {
    try {
      const response = await getProjectById(id);
      setProject(response);
      await fetchProjectUsers();
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const fetchProjectUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const users = await getUsersByProjectId(id);
      setProjectUsers(users);
    } catch (error) {
      console.error("Error fetching project users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllUsers();
    if (updated) {
      setUpdate(true);
    }
  }, [id, updated]);

  const handleAddUser = async () => {
    if (!selectedUser) return;
    
    try {
      await addUserToProject({ projectId: id, userId: selectedUser });
      Swal.fire({
        title: "Success",
        text: "User added to project successfully.",
        icon: "success",
        confirmButtonColor: "#4f46e5"
      });
      await fetchProjectUsers();
      setSelectedUser("");
    } catch (error) {
      console.error("Error adding user to project:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to add user to project.",
        icon: "error",
        confirmButtonColor: "#4f46e5"
      });
    }
  };

  const handleRemoveUser = async (userId) => {
    const result = await Swal.fire({
      title: "Remove Team Member?",
      text: "This user will no longer have access to the project.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Confirm Removal",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await removeUserFromProject({ projectId: id, userId });
        Swal.fire({
          title: "Removed",
          text: "User has been removed from the project.",
          icon: "success",
          confirmButtonColor: "#4f46e5"
        });
        await fetchProjectUsers();
      } catch (error) {
        console.error("Error removing user from project:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to remove user from project.",
          icon: "error",
          confirmButtonColor: "#4f46e5"
        });
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "All project data will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Project",
      cancelButtonText: "Cancel",
      focusCancel: true
    });

    if (result.isConfirmed) {
      try {
        await deleteProject(user.id, project._id);
        Swal.fire({
          title: "Deleted",
          text: "The project has been deleted.",
          icon: "success",
          confirmButtonColor: "#4f46e5"
        });
        navigate("/dashboard/profile");
      } catch (error) {
        console.error("Error deleting project:", error);
        Swal.fire({
          title: "Error",
          text: "There was an error deleting the project.",
          icon: "error",
          confirmButtonColor: "#4f46e5"
        });
      }
    }
  };

  const availableUsers = allUsers.filter(
    user => !projectUsers.some(projectUser => projectUser._id === user._id)
  );

  if (!project) {
    return <IsLoading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{project.title}</h1>
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(project.startDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              project.status === "completed" ? "bg-green-100 text-green-800" :
              project.status === "ongoing" ? "bg-blue-100 text-blue-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setUpdate(!update)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {update ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <FileEdit className="h-4 w-4 mr-2" />
                Edit Project
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Project Details */}
        <div className="lg:col-span-8">
          {update ? (
            <UpdateProject onUpdateSuccess={fetchData} />
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Project Overview</h2>
                <p className="text-gray-700 mb-6">{project.description}</p>
                
                <ProjectCards
                  id={project?._id}
                  title={project?.title}
                  description={project?.description}
                  startDate={project?.startDate ? new Date(project.startDate).toLocaleDateString() : ""}
                  status={project?.status}
                  onDelete={handleDelete}
                  onUpdate={() => setUpdate(true)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Team Management Section */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Team Management
              </h3>
            </div>
            
            <div className="p-6">
              {/* Add Team Member */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Team Member</label>
                <div className="flex space-x-2">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="flex-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select team member</option>
                    {availableUsers.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.role})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddUser}
                    disabled={!selectedUser}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm ${
                      selectedUser ? 
                      'bg-green-600 hover:bg-green-700 text-white' : 
                      'bg-gray-200 text-gray-500 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Team Members List */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Current Team ({projectUsers.length})</h4>
                {isLoadingUsers ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : projectUsers.length === 0 ? (
                  <div className="text-center py-4">
                    <Info className="mx-auto h-5 w-5 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No team members assigned yet</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {projectUsers.map(user => (
                      <li key={user._id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 font-medium">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveUser(user._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                          title="Remove from project"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;