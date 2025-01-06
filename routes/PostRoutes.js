import { createPost , getPostsByUserId } from "../controllers/postController.js"
import { Router } from 'express';

const router = Router();

router.route('/:idUser').post(createPost)
router.route('/getPostsByUserId/:id').get(getPostsByUserId)


export default router;