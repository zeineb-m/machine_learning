import axios from "axios";
export const URL = "http://localhost:3001/api"; 


export const getUser = async (id)=> {
    const res = await axios.get(`${URL}/users/${id}`);
    return res.data;
}