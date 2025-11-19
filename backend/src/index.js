import express from 'express';
import session from 'express-session';
import cors from 'cors';
const app = express();

import customerRoutes from './routes/CustomerRoutes.js';
import staffRoutes from './routes/StaffRoutes.js';
import menuItemRoutes from './routes/MenuItemRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';

app.use(express.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(cors({ origin: 'http://localhost:5173' })); // Adjust the origin as needed


app.use('/customers', customerRoutes);
app.use('/staff', staffRoutes);
app.use('/menu', menuItemRoutes);
app.use('/checkout', orderRoutes);

app.listen(3000, () => console.log('Connected to server on port 3000...'));