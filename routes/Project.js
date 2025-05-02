import { createProject, deleteProject, getAllProjects, getProjectById, getUserWithProjects , updateProject , addUserToProject , removeUserFromProject , getUsersByProjectId} from '../controllers/Project.js';

import { Router } from 'express';
const router = Router();

router.post("/" , createProject);
router.get("/" , getAllProjects);
router.get("/:id" , getUserWithProjects);
router.put("/:id" , updateProject);
router.get("/project-details/:id" , getProjectById);
router.delete("/:idUser/:idProject" , deleteProject);
router.post("/add-user" , addUserToProject);
router.delete("/remove-user" , removeUserFromProject);
router.get("/users/:id" , getUsersByProjectId);

export default router;