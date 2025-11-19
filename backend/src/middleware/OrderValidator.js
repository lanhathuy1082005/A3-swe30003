export const validatePlaceOrder = (req, res, next) => {
    const {customer_id, items, payment_method} = req.body;
    
    // Check required fields
    if (!customer_id) {
        return res.status(400).json({ message: 'customer_id is required' });
    }

    if (!items) {
        return res.status(400).json({ message: 'items is required' });
    }

    if (!payment_method) {
        return res.status(400).json({ message: 'payment_method is required' });
    }

    // Validate types
    if (typeof customer_id !== 'number' || customer_id <= 0) {
        return res.status(400).json({ message: 'customer_id must be a positive number' });
    }

    if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'items must be an array' });
    }

    if (items.length === 0) {
        return res.status(400).json({ message: 'items cannot be empty' });
    }

    // Validate payment method
    const validPaymentMethods = ['cash', 'card'];
    if (!validPaymentMethods.includes(payment_method.toLowerCase())) {
        return res.status(400).json({ 
            message: 'payment_method must be either "cash" or "card"' 
        });
    }

    // Validate each item
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (!item.id || typeof item.id !== 'number' || item.id <= 0) {
            return res.status(400).json({ 
                message: `Item at position ${i + 1} has invalid item_id` 
            });
        }

        if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
            return res.status(400).json({ 
                message: `Item at position ${i + 1} must have quantity greater than 0` 
            });
        }

        if (!Number.isInteger(item.quantity)) {
            return res.status(400).json({ 
                message: `Item at position ${i + 1} quantity must be a whole number` 
            });
        }
    }

    // If all validation passes, continue to controller
    next();
};