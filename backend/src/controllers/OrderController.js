import OrderService from "../services/OrderService.js";

export const placeOrder = async (req, res) => {
    try {
        const {customer_id, items, payment_method} = req.body;
        console.log(req.body);
        await OrderService.placeOrder(customer_id, items, payment_method);

        return res.status(201).json({ 
            message: 'Order placed successfully'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Cannot place order ' });
    }
};
