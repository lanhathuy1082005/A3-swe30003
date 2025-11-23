import PromotionStrategy from "./PromotionStrategy.js";
import Promotion from "../../../models/Promotion.js";

class FixedPricePromotionStrategy extends PromotionStrategy {

    async createGlobalPromotion(type, amount, min_quantity, free_quantity, start_date, end_date, active){
        return await Promotion.CreateGlobalDiscountPromotion(type, amount, start_date, end_date, active);
    }

    async createSpecificPromotion(type, amount, menu_id, min_quantity, free_quantity, start_date, end_date, active){
        return await Promotion.CreateSpecificDiscountPromotion(type, amount, menu_id, start_date, end_date, active);
    }

    applyPromotion(orderTotal, fixedPrice) {
        return Math.max(0, orderTotal - fixedPrice);
    }
}

export default FixedPricePromotionStrategy;