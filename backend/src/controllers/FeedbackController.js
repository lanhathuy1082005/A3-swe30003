import Feedback from '../models/Feedback.js';

export const createFeedback = async (req, res) => {
    try {
        const { content, order_id } = req.body;
        const customer_id = req.session.user.id;

        if (!customer_id) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Feedback content is required' });
        }

        const feedback = await Feedback.createFeedback(customer_id, content.trim(), order_id);

        return res.status(201).json({ 
            message: 'Feedback submitted successfully',
            feedback 
        });

    } catch (err) {
        console.error('Error creating feedback:', err);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        const isStaff = req.session.user.permissions && req.session.user.permissions.includes('update_order_status');
        
        if (!isStaff) {
            return res.status(403).json({ message: 'Access denied. Staff only.' });
        }

        const feedback = await Feedback.getAllFeedback();

        return res.status(200).json(feedback);
    } catch (err) {
        console.error('Error fetching all feedback:', err);
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
};

export const getMyFeedback = async (req, res) => {
    try {
        const customer_id = req.session.user.id;

        if (!customer_id) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const feedback = await Feedback.getFeedbackByCustomerId(customer_id);

        return res.status(200).json(feedback);
    } catch (err) {
        console.error('Error fetching customer feedback:', err);
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
};