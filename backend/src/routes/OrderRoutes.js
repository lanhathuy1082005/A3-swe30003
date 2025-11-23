import express from 'express';
import { requirePermission } from '../middleware/AuthMiddleware.js';
import { 
    placeOrder, 
    getOrders, 
    getOrderDetails, 
    updateOrderStatus, 
    cancelOrder 
} from '../controllers/OrderController.js';
import { validatePlaceOrder } from '../middleware/OrderValidator.js';

export const orderRoutes = express.Router();

orderRoutes.post('/', requirePermission("purchase_items"), validatePlaceOrder, placeOrder);
orderRoutes.get('/user/:user_id', getOrders);  
orderRoutes.get('/details/:order_id', getOrderDetails);
orderRoutes.patch('/:order_id/status', requirePermission("update_order_status"), updateOrderStatus);
orderRoutes.patch('/:order_id/cancel', cancelOrder);