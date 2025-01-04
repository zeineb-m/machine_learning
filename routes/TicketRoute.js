import { getAllTickets , deleteTicket , createTicket , getTicketById , updateTicket , buyTickets , setDiscount} from "../controllers/TicketController.js"
import { Router } from 'express';

const router = Router();

router.route('/').get(getAllTickets)
router.route('/:id').delete(deleteTicket)
router.route('/').post(createTicket)
router.route('/:id').delete(getTicketById)
router.route('/:id').put(updateTicket)
router.route('/buy/:id').put(buyTickets)
router.route('/discount/:id').put(setDiscount)


export default router;