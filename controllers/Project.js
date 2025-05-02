import {Project} from "../models/Project.js";
import {User} from "../models/User.js";


export const createProject = async (req , res) => {
    const {startDate , status , title, description , user_id} = req.body;
try {
    const user = await User.findById(user_id);
    if (!user) 
        return res.status(404).json({ message: 'User not found.' });
const newProject = await Project.create({startDate , status , title, description , user : user_id});
user.projects.push(newProject._id);
await user.save();
return res.status(200).json({ message: 'Project created successfully.' , project: newProject});
}catch(error){
    res.status(500).json({ error: error })
}
}

export const getAllProjects = async (req , res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch(error) {
        res.status(500).json({ error: error })
    }
}


export const getUserWithProjects = async (req , res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId).populate("projects");
      if (!user) 
        return res.status(404).json({ message: "User not found." });
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
};

export const updateProject = async (req , res) => {
    const { title, description , startDate , status } = req.body;
    const idProject = req.params.id;
    try {
        const project = await Project.findById(idProject);
        if (!project) 
            return res.status(404).json({ message: 'Project not found.' });
        project.title = title;
        project.description = description;
        project.startDate = startDate ;
        project.status = status ;
        await project.save();
        res.status(200).json({ message: 'Project updated successfully.' , project: project});
    }catch(error){
        res.status(500).json({ error: error })
    }
}

export const getProjectById = async (req , res) => {
    const idProject = req.params.id;
    try {
        const project = await Project.findById(idProject);
        if (!project) 
            return res.status(404).json({ message: 'Project not found.' });
        res.status(200).json(project);
    }catch(error){
        res.status(500).json({ error: error })
    }
}

export const deleteProject = async (req, res) => {
    const userId = req.params.idUser;
    const idProject = req.params.idProject;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        const project = await Project.findById(idProject);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        if (!user.projects.includes(idProject)) {
            return res.status(403).json({ message: "User does not own this project." });
        }
        user.projects.pull(idProject);
        await user.save();
        await Project.findByIdAndDelete(idProject);

        res.status(200).json({ message: "Project deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addUserToProject = async (req, res) => {
    const { userId, projectId } = req.body;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (project.users.includes(userId)) {
            return res.status(400).json({ message: "User already added to project." });
        }
        project.users.push(userId);
        await project.save();
        user.projects.push(projectId);
        await user.save();
        res.status(200).json({ message: "User added to project successfully." });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const removeUserFromProject = async (req, res) => {
    const { userId, projectId } = req.body;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!project.users.includes(userId)) {
            return res.status(400).json({ message: "User not found in project." });
        }
        project.users.pull(userId);
        await project.save();
        user.projects.pull(projectId);
        await user.save();
        res.status(200).json({ message: "User removed from project successfully." });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUsersByProjectId = async (req, res) => {
    const projectId = req.params.id ; 
    try {
        const project = await Project.findById(projectId).populate("users");
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        res.status(200).json(project.users);
    }catch(error) {
        res.status(500).json({ error: error.message });
    }
}
