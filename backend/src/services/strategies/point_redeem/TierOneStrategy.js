import PointRedeemStrategy from './PointRedeemStrategy.js';
class TierOneStrategy extends PointRedeemStrategy {
    redeemPoints(){
        throw new Error("Method 'redeemPoints()' must be implemented.");
    }
}

export default TierOneStrategy;