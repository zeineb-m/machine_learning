import React, { useEffect, useState, useContext } from "react";
import ProjectCards from "./card/ProjectCards";
import { getProjectById, deleteProject } from "@/api/project";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import IsLoading from "@/configs/isLoading";
import UpdateProject from "../UpdateProject";
import { AuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";

const ProjectDetails = () => {
  const { getCurrentUser } = useContext(AuthContext);
  const user = getCurrentUser();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [update, setUpdate] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const updated = searchParams.get("updated") === "true"; // ✅ Corrected

  const fetchData = async () => {
    try {
      const response = await getProjectById(id);
      setProject(response);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  useEffect(() => {
    fetchData();
    if (updated) {
      setUpdate(true);
    }
  }, [id, updated]);

  if (!project) {
    return <IsLoading />;
  }

  const handleDelete = async () => {
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
        await deleteProject(user.id, project._id);
        Swal.fire("Deleted!", "The project has been deleted.", "success");
        navigate("/dashboard/profile");
      } catch (error) {
        console.error("Error deleting project:", error);
        Swal.fire("Error", "There was an error deleting the project.", "error");
      }
    }
  };

  return (
    <>
      <p
        onClick={() => setUpdate(!update)}
        className="w-max px-6 py-3 bg-gradient-to-r from-green-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-green-700 hover:to-purple-700 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
      >
        {update ? "Cancel Update" : "Update Project"}
      </p>
      {update ? (
        <UpdateProject onUpdateSuccess={fetchData} />
      ) : (
        <ProjectCards
          title={project?.title}
          description={project?.description}
          startDate={project?.startDate ? new Date(project.startDate).toLocaleDateString() : ""}
          status={project?.status}
          onDelete={handleDelete}
          onUpdate={() => setUpdate(true)}
        />
      )}
    </>
  );
};

export default ProjectDetails;
