
import { getAllUsers , getUserById , deleteUserById, addUser , toggleUserStatus , updateUserById , changePassword} from '../controllers/User.js';
import { verify , verifyAdmin } from '../middleware/verifToken.js';
import { Router } from 'express';

import multer from 'multer';
const router = Router();
const upload = multer({ dest: 'uploads/' });

router.route('/').get(verifyAdmin ,  getAllUsers);
router.route('/:id').get(getUserById);
router.route('/:id').delete(deleteUserById);
router.post("/add", verifyAdmin , upload.single("image"), addUser);
router.route('/:id/toggle-status').put(toggleUserStatus);
router.put("/updateUser/:id" , updateUserById);  
router.put("/changePassword/:userId" , changePassword);

export default router;

