import express from 'express';
import axios from 'axios';

const router = express.Router();

// No multer, no upload — just a GET or POST call
router.get('/anomaly-detect', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/detect-anomalies');
    res.json(response.data);
  } catch (error) {
    console.error('Error calling Flask API:', error.message);
    res.status(500).json({ error: 'Failed to process anomaly detection' });
  }
});

export default router;
