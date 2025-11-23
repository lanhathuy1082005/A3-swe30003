import PromotionService from '../services/PromotionService.js';

export const createPromotion = async (req, res) => {
    try {
        const promotionData = req.body;
        const result = await PromotionService.createPromotion(promotionData);
        
        return res.status(201).json({ 
            message: 'Promotion created successfully',
            promotion: result
        });
    } catch (err) {
        console.error('Error creating promotion:', err);
        res.status(500).json({ message: 'Failed to create promotion: ' + err.message });
    }
};

export const getAllPromotions = async (req, res) => {
    try {
        const promotions = await PromotionService.getAllPromotions();
        return res.status(200).json(promotions);
    } catch (err) {
        console.error('Error fetching promotions:', err);
        res.status(500).json({ message: 'Failed to fetch promotions' });
    }
};

export const getPromotionById = async (req, res) => {
    try {
        const { id } = req.params;
        const promotion = await PromotionService.getPromotionById(id);
        
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        
        return res.status(200).json(promotion);
    } catch (err) {
        console.error('Error fetching promotion:', err);
        res.status(500).json({ message: 'Failed to fetch promotion' });
    }
};

export const togglePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        
        const result = await PromotionService.updatePromotion(id, active);
        
        return res.status(200).json({ 
            message: 'Promotion updated successfully',
            promotion: result
        });
    } catch (err) {
        console.error('Error updating promotion:', err);
        res.status(500).json({ message: 'Failed to update promotion' });
    }
};

export const deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        await PromotionService.deletePromotion(id);
        
        return res.status(200).json({ message: 'Promotion deleted successfully' });
    } catch (err) {
        console.error('Error deleting promotion:', err);
        res.status(500).json({ message: 'Failed to delete promotion' });
    }
};