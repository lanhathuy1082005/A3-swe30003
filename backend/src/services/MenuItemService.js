import MenuItem from '../models/MenuItem.js';

export default class MenuItemService {
    static async getMenu() {
        const items = await MenuItem.getAllMenuItems();
        return items;
    }

    static async addMenuItem(itemName,price,quantity) {
        await MenuItem.addMenuItem(itemName,price,quantity);
    }

    static async updateMenuItem(itemId,itemName,price,quantity) {
        await MenuItem.updateMenuItemById(itemId,itemName,price,quantity);
    }

    static async removeMenuItem(itemId){
        await MenuItem.removeMenuItemById(itemId);
    }
}