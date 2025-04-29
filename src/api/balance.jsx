import axios from "axios";


export const URL = "http://localhost:3001/api";

export const addBalance = async (projectId) => {
    const res = await axios.post(`${URL}/balance/${projectId}`) ;
    return res.data;
}

export const getBalance = async (projectId) => {
    const res = await axios.get(`${URL}/balance/${projectId}`);
    return res.data;
}