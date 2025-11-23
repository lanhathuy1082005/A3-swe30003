import OrderService from "../services/OrderService.js";

export const placeOrder = async (req, res) => {
    try {
        const { customer_id, items, payment_method, promotion_id } = req.body;
        
        const result = await OrderService.placeOrder(customer_id, items, payment_method, promotion_id);

        return res.status(201).json({ 
            message: 'Order placed and paid successfully',
            order: result
        });

    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ message: err.message || 'Cannot place order' });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { user_id } = req.params;
        const isStaff = req.session.permissions && req.session.permissions.includes('update_order_status');
        
        const orders = await OrderService.getOrders(user_id, isStaff);

        return res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { order_id } = req.params;
        
        const orderDetails = await OrderService.getOrderDetails(order_id);
        
        return res.status(200).json(orderDetails);
    } catch (err) {
        console.error('Error fetching order details:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch order details' });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { order_status } = req.body;
        
        await OrderService.updateOrderStatus(order_id, order_status);
        
        return res.status(200).json({ message: 'Order status updated successfully' });
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ message: err.message || 'Failed to update order status' });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const customer_id = req.session.userId;
        
        await OrderService.cancelOrder(order_id, customer_id);
        
        return res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling order:', err);
        res.status(500).json({ message: err.message || 'Failed to cancel order' });
    }
};