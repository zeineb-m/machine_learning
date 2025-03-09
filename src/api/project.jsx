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