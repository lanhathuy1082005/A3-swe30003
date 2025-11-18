import pool from '../Database.js';

class Feedback {
    constructor(userId, content) {
        this.userId = userId;
        this.content = content;
    }

    linkToOrder(orderId) {
        this.orderId = orderId;
    }
}