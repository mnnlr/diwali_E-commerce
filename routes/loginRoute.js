import { Router } from "express";

import { body} from 'express-validator';

const router = Router();

import { Login } from "../controllers/LoginController.js";
import validate from "../middleware/validate.js";

router.post("/", 
    [
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email address'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    validate,
    Login
);

export default router;