import { createProject, deleteProject, getAllProjects, getProjectById, getUserWithProjects , updateProject } from '../controllers/Project.js';

import { Router } from 'express';
const router = Router();

router.post("/" , createProject);
router.get("/" , getAllProjects);
router.get("/:id" , getUserWithProjects);
router.put("/:id" , updateProject);
router.get("/project-details/:id" , getProjectById);
router.delete("/:idUser/:idProject" , deleteProject);

export default router;