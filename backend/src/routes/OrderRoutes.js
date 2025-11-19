import express from 'express';
import { placeOrder} from '../controllers/OrderController.js';
import { validatePlaceOrder } from '../middleware/OrderValidator.js';
const orderRoutes = express.Router();

orderRoutes.post('/', validatePlaceOrder, placeOrder);
export default orderRoutes;