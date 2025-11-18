import User from "./User.js";

class Staff extends User {
    constructor(id, name, email) {
        super(id, name, email);
    }

    markedOrderAsReceived(orderId) {}
    markedOrderAsPrepared(orderId) {}
    
    createMenuItem(name, price, quantity) {
        //logic to create a new menu item
    }

    updateMenuItem(itemId) {
        //logic to update an existing menu item
    }

    deleteMenuItem(itemId) {
        //logic to delete a menu item
    }
    


}

export default Staff;