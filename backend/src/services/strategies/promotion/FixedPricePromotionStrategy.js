import PromotionStrategy from "./PromotionStrategy.js";

class FixedPricePromotionStrategy extends PromotionStrategy {
    applyPromotion(orderTotal, fixedPrice) {
        return orderTotal - fixedPrice;
    }
}

export default FixedPricePromotionStrategy;