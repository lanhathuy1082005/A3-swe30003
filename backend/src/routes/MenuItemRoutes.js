import {getMenu, addItem, removeItem, updateItem} from '../controllers/MenuItemController.js';
import { validateAddItem, validateUpdateItem, validateRemoveItem } from '../middleware/MenuValidator.js';
import { requirePermission } from '../middleware/AuthMiddleware.js';
import express from 'express';
export const menuItemRoutes = express.Router();

menuItemRoutes.get("/", getMenu);

menuItemRoutes.post("/add", requirePermission("edit_menu"), validateAddItem, addItem);

menuItemRoutes.put("/update/:id",requirePermission("edit_menu"), validateUpdateItem, updateItem);

menuItemRoutes.delete("/remove/:id",requirePermission("edit_menu"), validateRemoveItem, removeItem);
