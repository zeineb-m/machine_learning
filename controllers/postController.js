import {User} from '../models/User.js';
import { Post } from '../models/Post.js';

export const createPost = (req, res) => {
    const idUser = req.params.idUser;
    const title = req.body.title ;
    try {
        const user = User.findById(idUser);
        if (!user) return res.status(404).json({ message: "User not found" });
        const post = new Post({ title,  postedBy : idUser });
        post.save();
    res.json(post);
    } catch(error) {
    res.status(500).json({ message: error.message });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const getPostsByUserId = async (req, res) => {
    const id = req.params.id; 
    try {
        const posts = await Post.find({ postedBy: id }).populate("postedBy", "username email");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
