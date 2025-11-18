import express from 'express';
const app = express();

import customerRoutes from './routes/CustomerRoutes.js';
import staffRoutes from './routes/StaffRoutes.js';

app.use('/customers', customerRoutes);
app.use('/staff', staffRoutes);

app.listen(3000, () => console.log('Hello, World!'));