import {getMenu} from '../controllers/MenuItemController.js';
import express from 'express';
const menuItemRoutes = express.Router();

menuItemRoutes.get("/", getMenu);
export default menuItemRoutes;