import express from 'express';
import { requirePermission } from '../middleware/AuthMiddleware.js';
import { placeOrder} from '../controllers/OrderController.js';
import { validatePlaceOrder } from '../middleware/OrderValidator.js';
export const orderRoutes = express.Router();

orderRoutes.post('/', requirePermission("purchase_items"), validatePlaceOrder, placeOrder);