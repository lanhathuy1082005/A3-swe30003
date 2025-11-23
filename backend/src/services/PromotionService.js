import Promotion from '../models/Promotion.js';
import PromotionStrategyProcessor from './strategies/promotion/PromotionStrategyProcessor.js';
import PercentagePromotionStrategy from './strategies/promotion/PercentagePromotionStrategy.js';
import FixedPricePromotionStrategy from './strategies/promotion/FixedPricePromotionStrategy.js';
import BogoPromotionStrategy from './strategies/promotion/BogoPromotionStrategy.js';

class PromotionService {
    
    static async createPromotion(promotionData) {
        const { type, amount, menu_id, min_quantity, free_quantity, start_date, end_date, active } = promotionData;
        
        const processor = new PromotionStrategyProcessor();
        const isGlobal = !menu_id;

        switch(type) {
            case 'percentage':
                processor.setStrategy(new PercentagePromotionStrategy());
                if (isGlobal) {
                    return await processor.createGlobalPromotion(
                        type, amount, null, null, start_date, end_date, active
                    );
                } else {
                    return await processor.createSpecificPromotion(
                        type, amount, menu_id, null, null, start_date, end_date, active
                    );
                }
            
            case 'fixed':
                processor.setStrategy(new FixedPricePromotionStrategy());
                if (isGlobal) {
                    return await processor.createGlobalPromotion(
                        type, amount, null, null, start_date, end_date, active
                    );
                } else {
                    return await processor.createSpecificPromotion(
                        type, amount, menu_id, null, null, start_date, end_date, active
                    );
                }
            
            case 'bogo':
                processor.setStrategy(new BogoPromotionStrategy());
                if (isGlobal) {
                    return await processor.createGlobalPromotion(
                        type, null, min_quantity, free_quantity, start_date, end_date, active
                    );
                } else {
                    return await processor.createSpecificPromotion(
                        type, null, menu_id, min_quantity, free_quantity, start_date, end_date, active
                    );
                }
            
            default:
                throw new Error('Invalid promotion type');
        }
    }

    static async getAllPromotions() {
        return await Promotion.getAllPromotion();
    }

    static async getPromotionById(id) {
        return await Promotion.getPromotionById(id);
    }

    static async updatePromotion(id, active) {
        return await Promotion.updatePromotionActive(id, active);
    }

    static async deletePromotion(id) {
        return await Promotion.deletePromotionById(id);
    }
}

export default PromotionService;