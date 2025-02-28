import { createProject, getAllProjects, getUserWithProjects } from '../controllers/Project.js';

import { Router } from 'express';
const router = Router();

router.post("/" , createProject);
router.get("/" , getAllProjects);
router.get("/:id" , getUserWithProjects);

export default router;

