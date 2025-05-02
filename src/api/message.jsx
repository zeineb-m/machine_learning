import axios from "axios";

const URL = "http://localhost:3001/api";

export const sendMessage = async (content, projectId, senderId) => {
  const res = await axios.post(`${URL}/messages`, { content, projectId }, {
    params: { senderId }
  });
  return res.data;
};

export const getProjectMessages = async (projectId, userId) => {
  const res = await axios.get(`${URL}/messages/project/${projectId}`, {
    params: { userId }
  });
  return res.data;
};

export const markMessageAsRead = async (messageId, userId) => {
  const res = await axios.put(`${URL}/messages/${messageId}/read`, null, {
    params: { userId }
  });
  return res.data;
};