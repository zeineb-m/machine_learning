
import { getAllUsers , getUserById , deleteUserById} from '../controllers/User.js';
import { verify , verifyAdmin } from '../middleware/verifToken.js';
import { Router } from 'express';
const router = Router();


router.route('/').get(verifyAdmin ,verify , getAllUsers);
router.route('/:id').get(verify, getUserById);
router.route('/:id').delete(verify , deleteUserById);

export default router;

