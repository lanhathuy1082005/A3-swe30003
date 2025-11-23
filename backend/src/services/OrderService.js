import pool from '../Database.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import Promotion from '../models/Promotion.js';
import PromotionStrategyProcessor from './strategies/promotion/PromotionStrategyProcessor.js';
import PercentagePromotionStrategy from './strategies/promotion/PercentagePromotionStrategy.js';
import FixedPricePromotionStrategy from './strategies/promotion/FixedPricePromotionStrategy.js';
import BogoPromotionStrategy from './strategies/promotion/BogoPromotionStrategy.js';

export default class OrderService {
    
    // Fake payment verification
    static verifyPayment(payment_method, payment_info = null) {
        if (!['cash', 'card'].includes(payment_method)) {
            throw new Error('Invalid payment method');
        }
        
        // Simulate payment success
        return true;
    }

    static async placeOrder(customer_id, items, payment_method, promotion_id = null) {
        // CHECK PAYMENT FIRST - before creating order
        const paymentSuccess = this.verifyPayment(payment_method);
        if (!paymentSuccess) {
            throw new Error('Payment failed');
        }

        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Validate items
            for (let item of items) {
                const menuItem = await MenuItem.getMenuItemById(item.id);
                if (!menuItem) {
                    throw new Error(`Menu item ${item.id} not found`);
                }
                if (menuItem.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${menuItem.item_name}`);
                }
            }
           
            let subtotal = 0;
            const itemDetails = [];

            // Calculate subtotal
            for (let item of items) {
                const menuItem = await MenuItem.getMenuItemById(item.id);
                const itemSubtotal = menuItem.price * item.quantity;
                
                itemDetails.push({
                    id: item.id,
                    quantity: item.quantity,
                    unitPrice: menuItem.price,
                    subtotal: itemSubtotal
                });
                
                subtotal += itemSubtotal;
            }

            // Apply promotion if provided
            let discount = 0;
            let final_price = subtotal;

            if (promotion_id) {
                const promo = await Promotion.getPromotionById(promotion_id);
                
                if (promo && promo.active) {
                    const now = new Date();
                    const startDate = new Date(promo.start_date);
                    const endDate = new Date(promo.end_date);
                    
                    if (now >= startDate && now <= endDate) {
                        discount = await this.calculateDiscount(promo, items, itemDetails);
                        final_price = Math.max(0, subtotal - discount);
                    }
                }
            }

            // Calculate loyalty points
            const points_earned = Math.floor(final_price / 10);

            // Create order (PAYMENT ALREADY VERIFIED)
            const order = await Order.createOrder(
                customer_id, 
                final_price, 
                payment_method, 
                promotion_id, 
                points_earned, 
                0
            );

            // Create order items and update inventory
            for (let itemDetail of itemDetails) {
                await OrderItem.createOrderItem(
                    order.id,
                    itemDetail.id,
                    itemDetail.quantity,
                    itemDetail.unitPrice,
                    itemDetail.subtotal
                );

                const menuItem = await MenuItem.getMenuItemById(itemDetail.id);
                const new_quantity = menuItem.quantity - itemDetail.quantity;
                await MenuItem.updateMenuItemQuantity(itemDetail.id, new_quantity);
            }

            // Update user loyalty points
            await User.updateLoyaltyPoints(customer_id, points_earned);

            await client.query('COMMIT');
            
            return {
                orderId: order.id,
                subtotal,
                discount,
                final_price,
                points_earned,
                payment_status: 'paid'  // Since we verified payment first
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async calculateDiscount(promo, items, itemDetails) {
        const processor = new PromotionStrategyProcessor();
        let discount = 0;

        switch(promo.type) {
            case 'percentage':
                processor.setStrategy(new PercentagePromotionStrategy());
                
                if (promo.menu_id) {
                    const targetItem = itemDetails.find(i => i.id === promo.menu_id);
                    if (targetItem) {
                        discount = targetItem.subtotal - processor.applyPromotion(targetItem.subtotal, promo.amount);
                    }
                } else {
                    const subtotal = itemDetails.reduce((sum, item) => sum + item.subtotal, 0);
                    discount = subtotal - processor.applyPromotion(subtotal, promo.amount);
                }
                break;

            case 'fixed':
                processor.setStrategy(new FixedPricePromotionStrategy());
                
                if (promo.menu_id) {
                    const targetItem = itemDetails.find(i => i.id === promo.menu_id);
                    if (targetItem) {
                        discount = Math.min(promo.amount, targetItem.subtotal);
                    }
                } else {
                    const subtotal = itemDetails.reduce((sum, item) => sum + item.subtotal, 0);
                    discount = Math.min(promo.amount, subtotal);
                }
                break;

            case 'bogo':
                processor.setStrategy(new BogoPromotionStrategy());
                
                if (promo.menu_id) {
                    const targetItem = items.find(i => i.id === promo.menu_id);
                    if (targetItem && targetItem.quantity >= promo.min_quantity) {
                        const menuItem = await MenuItem.getMenuItemById(promo.menu_id);
                        discount = promo.free_quantity * menuItem.price;
                    }
                }
                break;
        }

        return discount;
    }

    static async getOrders(userId, isStaff) {
        if (isStaff) {
            return await Order.getAllOrders();
        } else {
            return await Order.getOrdersByCustomerId(userId);
        }
    }

    static async getOrderDetails(orderId) {
        const order = await Order.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const items = await OrderItem.getOrderItems(orderId);
        
        return { ...order, items };
    }

    static async updateOrderStatus(orderId, status) {
        const order = await Order.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        return await Order.updateOrderStatus(orderId, status);
    }

    static async cancelOrder(orderId, customerId) {
        const order = await Order.getOrderById(orderId);
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        if (order.customer_id !== customerId) {
            throw new Error('Unauthorized');
        }
        
        if (!['pending', 'preparing'].includes(order.order_status)) {
            throw new Error('Cannot cancel order at this stage');
        }
        
        return await Order.updateOrderStatus(orderId, 'cancelled');
    }
}