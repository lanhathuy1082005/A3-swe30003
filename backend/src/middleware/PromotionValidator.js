import { body, validationResult } from 'express-validator';

export const validatePromotion = [
    body('type').isIn(['percentage', 'fixed', 'bogo']).withMessage('Invalid promotion type'),
    body('start_date').isISO8601().withMessage('Invalid start date'),
    body('end_date').isISO8601().withMessage('Invalid end date'),
    body('active').isBoolean().withMessage('Active must be boolean'),
    
    // Conditional validation
    body('amount').if(body('type').isIn(['percentage', 'fixed']))
        .notEmpty().withMessage('Amount is required for discount promotions')
        .isFloat({ min: 0 }).withMessage('Amount must be positive'),
    
    body('min_quantity').if(body('type').equals('bogo'))
        .notEmpty().withMessage('Min quantity is required for BOGO')
        .isInt({ min: 1 }).withMessage('Min quantity must be at least 1'),
    
    body('free_quantity').if(body('type').equals('bogo'))
        .notEmpty().withMessage('Free quantity is required for BOGO')
        .isInt({ min: 1 }).withMessage('Free quantity must be at least 1'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];