class PromotionStrategy {
    createGlobalPromotion(){
        throw new Error("Method 'createGlobalPromotion()' must be implemented.");
    }

    createSpecificPromotion(){
        throw new Error("Method 'createSpecificPromotion()' must be implemented.");
    }
    
    applyPromotion(){
        throw new Error("Method 'applyPromotion()' must be implemented.");
    }
}

export default PromotionStrategy;