import express from 'express';
import { createFeedback, getAllFeedback, getMyFeedback } from '../controllers/FeedbackController.js';
import { requirePermission } from '../middleware/AuthMiddleware.js';

export const feedbackRoutes = express.Router();

feedbackRoutes.post('/', createFeedback);

feedbackRoutes.get('/all', requirePermission('update_order_status'), getAllFeedback);

feedbackRoutes.get('/my', getMyFeedback);