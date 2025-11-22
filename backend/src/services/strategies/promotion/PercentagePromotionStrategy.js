import PromotionStrategy from "./PromotionStrategy";
class PercentagePromotionStrategy extends PromotionStrategy {
    applyPromotion(orderTotal, percentage) {
        return orderTotal * (1 - percentage / 100);
    }
}

export default PercentagePromotionStrategy;