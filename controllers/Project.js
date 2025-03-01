import {Project} from "../models/Project.js";
import {User} from "../models/User.js";


export const createProject = async (req , res) => {
    const { title, description , user_id} = req.body;
try {
    const user = await User.findById(user_id);
    if (!user) 
        return res.status(404).json({ message: 'User not found.' });
const newProject = await Project.create({ title, description , user : user_id});
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
    const { title, description } = req.body;
    const idProject = req.params.id;
    try {
        const project = await Project.findById(idProject);
        if (!project) 
            return res.status(404).json({ message: 'Project not found.' });
        project.title = title;
        project.description = description;
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
