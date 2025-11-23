class PromotionStrategyProcessor {
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async createGlobalPromotion(type, amount, min_quantity, free_quantity, start_date, end_date, active) {
        return await this.strategy.createGlobalPromotion(type, amount, min_quantity, free_quantity, start_date, end_date, active);
    }

    async createSpecificPromotion(type, amount, menu_id, min_quantity, free_quantity, start_date, end_date, active) {
        return await this.strategy.createSpecificPromotion(type, amount, menu_id, min_quantity, free_quantity, start_date, end_date, active);
    }

    applyPromotion(...args) {
        return this.strategy.applyPromotion(...args);
    }
}

export default PromotionStrategyProcessor;