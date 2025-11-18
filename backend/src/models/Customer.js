import pool from '../Database.js';
import User from "./User.js";

class Customer extends User {
    constructor(id, name, email) {
        super(id, name, email);
    }
    
    initiateOrder(){}

    viewOrderHistory(){}

    getLoyaltyPoints(){
        return this.loyaltyPoints;
    }
    addLoyaltyPoints(points){
        this.loyaltyPoints = this.loyaltyPoints + points;
    }

    redeemLoyaltyPoints(points){}


}

export default Customer;