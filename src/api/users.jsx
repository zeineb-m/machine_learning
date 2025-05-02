import axios from "axios";

export const URL = "http://localhost:3001/api";  

export const getUser = async (id) => {
  const res = await axios.get(`${URL}/users/${id}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get(`${URL}/users` , {
    headers: {
      token: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
}


export const updateUser = async (id, userData) => {
  const res = await axios.put(`${URL}/users/updateUser/${id}`, userData);
  return res.data;
};


export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.put(`http://localhost:3001/api/users/changePassword/${userId}`, {
      currentPassword : currentPassword,
      newPassword : newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe :", error);
    throw error;
  }
};


