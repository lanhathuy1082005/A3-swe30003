import PointRedeemStrategy from './PointRedeemStrategy.js';
class AHundredPlusPointRedeemStrategy extends PointRedeemStrategy {
    redeemPoints(){
        throw new Error("Method 'redeemPoints()' must be implemented.");
    }
}

export default AHundredPlusPointRedeemStrategy;