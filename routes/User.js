
import { getAllUsers , getUserById , deleteUserById} from '../controllers/User.js';
import { verify , verifyAdmin } from '../middleware/verifToken.js';
import { Router } from 'express';
const router = Router();


router.route('/').get( getAllUsers);
router.route('/:id').get(getUserById);
router.route('/:id').delete(deleteUserById);

export default router;

