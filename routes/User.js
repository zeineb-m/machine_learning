
import { getAllUsers , getUserById , deleteUserById, addUser , toggleUserStatus} from '../controllers/User.js';
import { verify , verifyAdmin } from '../middleware/verifToken.js';
import { Router } from 'express';

import multer from 'multer';
const router = Router();
const upload = multer({ dest: 'uploads/' });

router.route('/').get( getAllUsers);


router.route('/:id').get(getUserById);
router.route('/:id').delete(deleteUserById);
router.post("/add", upload.single("image"), addUser);
router.route('/:id/toggle-status').put(toggleUserStatus);
export default router;

