import express from "express";
import {validateHandleLogin} from '../middleware/UserValidator.js'
import {validateHandleRegister} from '../middleware/UserValidator.js'
import {handleLogin} from '../controllers/UserController.js'
import {handleRegister} from '../controllers/UserController.js'
import { handleLogout } from "../controllers/UserController.js";
import { getCurrentUser } from "../controllers/UserController.js";
export const userRoutes = express.Router();

userRoutes.post("/register",validateHandleRegister, handleRegister);

userRoutes.post("/login", validateHandleLogin, handleLogin);

userRoutes.post("/logout",handleLogout);

userRoutes.get("/session",getCurrentUser);
