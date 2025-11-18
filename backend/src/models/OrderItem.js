import MenuItem from './MenuItem.js';

class OrderItem{
    constructor(itemId, quantity) {
        this.itemId = itemId;
        this.quantity = quantity;
    }

    addItemToOrder(itemId, quantity) {
        //logic to add item to order
    }

    removeItemFromOrder(itemId,quantity) {

    }


    calculateSubstotal() {
        return this.price * this.quantity;
    }
}