import { Router } from "express";

import { body} from 'express-validator';
import validate from "../middleware/validate.js";

const router = Router();

import { Register } from "../controllers/RegisterController.js";

router.post("/", 
    [
        body('name').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email address'),
        body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    validate,
    Register
);

export default router;