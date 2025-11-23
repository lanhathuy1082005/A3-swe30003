import PromotionStrategy from "./PromotionStrategy.js";
import Promotion from "../../../models/Promotion.js";

class PercentagePromotionStrategy extends PromotionStrategy {

    async createGlobalPromotion(type, amount, min_quantity, free_quantity, start_date, end_date, active){
        return await Promotion.CreateGlobalDiscountPromotion(type, amount, start_date, end_date, active);
    }

    async createSpecificPromotion(type, amount, menu_id, min_quantity, free_quantity, start_date, end_date, active){
        return await Promotion.CreateSpecificDiscountPromotion(type, amount, menu_id, start_date, end_date, active);
    }

    applyPromotion(orderTotal, percentage) {
        return orderTotal * (1 - percentage / 100);
    }
}

export default PercentagePromotionStrategy;