import User from "./User.js";

class Customer extends User {
    constructor(id, name, pass, email, role, loyalty_points) {
        super(id, name, pass, email, role);
        this.loyalty_points = loyalty_points;
    }   
}

export default Customer;