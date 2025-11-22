import PointRedeemStrategy from './PointRedeemStrategy.js';
class TierTwoStrategy extends PointRedeemStrategy {
    redeemPoints(){
        throw new Error("Method 'redeemPoints()' must be implemented.");
    }
}

export default TierTwoStrategy;