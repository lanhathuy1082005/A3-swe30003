import PromotionStrategy from "./PromotionStrategy.js";
import Promotion from "../../../models/Promotion.js";

class BogoPromotionStrategy extends PromotionStrategy {

    async createGlobalPromotion(type, amount, min_quantity, free_quantity, start_date, end_date, active){
        return await Promotion.CreateGlobalBogoPromotion(type, min_quantity, free_quantity, start_date, end_date, active);
    }

    async createSpecificPromotion(type, amount, menu_id, min_quantity, free_quantity, start_date, end_date, active){
        return await Promotion.CreateSpecificBogoPromotion(type, menu_id, min_quantity, free_quantity, start_date, end_date, active);
    }

    applyPromotion(items, menuId, minQuantity, freeQuantity, unitPrice) {
        const targetItem = items.find(item => item.item_id === menuId);
        if (!targetItem || targetItem.quantity < minQuantity) {
            return 0;
        }
        
        const discount = freeQuantity * unitPrice;
        return discount;
    }
}

export default BogoPromotionStrategy;