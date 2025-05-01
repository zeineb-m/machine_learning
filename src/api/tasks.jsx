import axios from "axios";

const URL = "http://localhost:3001/api/accounting-task";

export const getTasks = async (userId) => {
    try {
        const response = await axios.get(`${URL}?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await axios.post(URL, taskData);
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        const response = await axios.put(`${URL}/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await axios.delete(`${URL}/${taskId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};