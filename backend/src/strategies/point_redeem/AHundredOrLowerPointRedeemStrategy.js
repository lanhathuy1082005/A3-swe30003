import PointRedeemStrategy from './PointRedeemStrategy.js';
class AHundredOrLowerPointRedeemStrategy extends PointRedeemStrategy {
    redeemPoints(){
        throw new Error("Method 'redeemPoints()' must be implemented.");
    }
}

export default AHundredOrLowerPointRedeemStrategy;