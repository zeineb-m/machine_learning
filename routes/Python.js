import express from 'express';
import axios from 'axios'; 

const router = express.Router();

router.get('/generate-bilan', async (req, res) => {
    const { project_id } = req.query;
    if (!project_id) {
        return res.status(400).json({ error: "Le project_id est requis" });
    }

    try {
        // Appel à l'API Flask
        const response = await axios.get(`http://localhost:5000/generate-bilan?project_id=${project_id}`);
        res.json(response.data);
    } catch (error) {
        console.error("Erreur lors de l'appel à Flask :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération du bilan" });
    }
});

export default router;
