import User from "./User.js";

class Staff extends User {
    constructor(id, name, email, role) {
        super(id, name, email, role);
    }

    markedAsReceived(orderId) {}
    markedAsPrepared(orderId) {}

    


}

export default Staff;