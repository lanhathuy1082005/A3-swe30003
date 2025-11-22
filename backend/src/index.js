import express from 'express';
import session from 'express-session';
import cors from 'cors';
const app = express();


import {userRoutes} from './routes/UserRoutes.js';
import {menuItemRoutes} from './routes/MenuItemRoutes.js';
import {orderRoutes} from './routes/OrderRoutes.js';

app.use(express.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true } // Set to true if using HTTPS
}));
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Adjust the origin as needed


app.use('/user', userRoutes);
app.use('/menu', menuItemRoutes);
app.use('/checkout', orderRoutes);

app.listen(3000, () => console.log('Connected to server on port 3000...'));