import OrderItem from "../models/OrderItem.js";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

export const placeOrder = async (req, res) => {
    try {
        const {customer_id, items, payment_method} = req.body;
        console.log(req.body);
        let final_price = 0;

        // Create a new order
        console.log("Creating order...");
        const order = await Order.createOrder(customer_id, final_price, payment_method);
        console.log("Order created with ID:", order.id);

        // Create order items and calculate final price
        console.log("Creating order items...");
        for (let item of items) {

            console.log("Processing item:", item);
            let orderItem = await OrderItem.createOrderItem(item.item_id, order.id, item.quantity);
            console.log("Order item created:", orderItem);

            let new_quantity = (await MenuItem.getMenuQuantityById(item.item_id)).quantity - item.quantity;
            console.log("Updating menu item quantity to:", new_quantity);

            await MenuItem.updateMenuItemQuantity(item.item_id, new_quantity);
            console.log("Menu item quantity updated for item ID:", item.item_id);
            
            final_price += orderItem.subtotal;
            console.log("Updated final price:", final_price);
        }

        // Update the final price of the order
        await Order.updateOrderFinalPrice(order.id, final_price);
        console.log("Final price updated for order ID:", order.id);

        return res.status(201).json({ 
            message: 'Order placed successfully',
            order: {
                id: order.id,
                final_price: final_price}
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Cannot place order ' });
    }
};
