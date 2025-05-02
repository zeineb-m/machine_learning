import axios from "axios";

export const URL = "http://localhost:3001/api";

export const getUserWithProjects = async (id) => {
    const res = await axios.get(`${URL}/project/${id}`);
    return res.data;
  };

export const getProjectById = async (id) => {
    const res = await axios.get(`${URL}/project/project-details/${id}`);
    return res.data;
  }

export const addNewProject = async (data) => {
  const res = await axios.post(`${URL}/project` , data) ;
  return res ; 
}

export const updateProject =  async (id , data) => {
const res = await axios.put(`${URL}/project/${id}` , data);
return res ;
}

export const deleteProject = async (idUser , idProject) => {
  const res = await axios.delete(`${URL}/project/${idUser}/${idProject}`) ;
  return res ;
}

export const addUserToProject = async (data) => {
  const res = await axios.post(`${URL}/project/add-user` , data) ;
  return res.data ; 
}

export const removeUserFromProject = async (data) => {
  const res = await axios.delete(`${URL}/project/remove-user` , { data }) ;
  return res.data ;
}

export const getUsersByProjectId = async (id) => {
  const res = await axios.get(`${URL}/project/users/${id}`) ;
  return res.data ; 

}

export const getGrandLivre = async (projectId) => {
  try {
    console.log("Fetching Grand Livre for project", projectId);
    const res = await axios.get(`${URL}/grandLivre/read-csv/${projectId}`);

    
    if (!res.data) {
      console.error("Invalid response format:", res.data);
      return [];
    }

    
    if (Array.isArray(res.data)) {
      console.log("Data returned successfully:", res.data.length, "entries");
      return res.data.map(entry => ({
        "Numero de compte": entry["Numero de compte"] || "",
        "Categorie": entry["Categorie"] || "",
        "Designation": entry["Designation"] || "",
        "Debit": entry["Debit"] || "0",
        "Credit": entry["Credit"] || "0",
        "Total": entry["Total"] || "0"
      }));
    } else {
      console.error("Response is not an array:", res.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching Grand Livre:", error);
    return []; 
  }
};

export const saveGrandLivreToDB = async (data) => {
  try {
    const res = await axios.post(`${URL}/grandLivre/save`, data);   return res.data;
  } catch (error) {
    console.error("Error saving Grand Livre:", error);
    throw error;
  }
};