import pool from '../Database.js';

class Order {
    constructor(orderId, customerId) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.items = []; // Array of item objects
        this.totalAmount = 0; //set to 0 initially
        this.order_status = 'Pending'; // Default status
        this.payment_status = 'Unpaid'; // Default payment status
    }

    markOrderAsConfirmed() {
        this.order_status = 'Confirmed';
    }

    


}

async function getAllMenuItems() {
  const res = await pool.query('SELECT * FROM menu');
  console.log(res.rows);
}

getAllMenuItems();


export default Order;