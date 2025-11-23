import express from 'express';
import { 
    createPromotion, 
    getAllPromotions, 
    getPromotionById, 
    togglePromotion, 
    deletePromotion 
} from '../controllers/PromotionController.js';

const promotionRoutes = express.Router();

promotionRoutes.post('/', createPromotion);
promotionRoutes.get('/', getAllPromotions);
promotionRoutes.get('/:id', getPromotionById);
promotionRoutes.patch('/:id/toggle', togglePromotion);
promotionRoutes.delete('/:id', deletePromotion);

export { promotionRoutes };