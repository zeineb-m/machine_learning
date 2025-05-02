import axios from "axios";

const API_URL = "http://localhost:3001/api/claims";

export const getClaims = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getClaimById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createClaim = async (claim) => {
  const res = await axios.post(API_URL, claim);
  return res.data;
};

export const updateClaim = async (id, claim) => {
  const res = await axios.put(`${API_URL}/${id}`, claim);
  return res.data;
};

export const deleteClaim = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
