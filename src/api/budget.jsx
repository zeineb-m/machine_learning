import axios from "axios";

export const URL = "http://localhost:3001/api";

// Budget Management Functions
export const uploadBudgetFile = async (formData) => {
  try {
    const res = await axios.post(`${URL}/budget/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error uploading budget file:", error);
    throw error;
  }
};

export const getBudgetByProject = async (projectId) => {
  try {
    console.log("Fetching budget for project:", projectId);
    const res = await axios.get(`${URL}/budget/project/${projectId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching budget:", error);
    
    // Return a default empty budget structure instead of throwing an error
    return {
      project: projectId,
      items: [],
      description: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
};

export const createOrUpdateBudget = async (budgetData) => {
  try {
    const res = await axios.post(`${URL}/budget`, budgetData);
    return res.data;
  } catch (error) {
    console.error("Error creating/updating budget:", error);
    throw error;
  }
};

// Budget Variance Analysis Functions
export const generateBudgetVariance = async (data) => {
  try {
    const res = await axios.post(`${URL}/budget-variance/generate`, data);
    return res.data;
  } catch (error) {
    console.error("Error generating budget variance:", error);
    throw error;
  }
};

export const getBudgetVarianceByProject = async (projectId, trimestre, annee) => {
  try {
    let url = `${URL}/budget-variance/project/${projectId}`;
    if (trimestre && annee) {
      url += `?trimestre=${trimestre}&annee=${annee}`;
    }
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Budget variance not found, return empty data
      return null;
    }
    console.error("Error fetching budget variance:", error);
    throw error;
  }
};

export const exportBudgetVarianceToExcel = async (budgetVarianceId) => {
  try {
    window.open(`${URL}/budget-variance/export/${budgetVarianceId}`);
    return true;
  } catch (error) {
    console.error("Error exporting budget variance to Excel:", error);
    throw error;
  }
}; 