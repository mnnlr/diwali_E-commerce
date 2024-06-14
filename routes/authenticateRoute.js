import { Router } from "express";

const router = Router()

import { authenticate } from "../controller/authenticateController.js";
import {isAuthenticated} from "../middleware/authenticate.js";

router.route('/').get(isAuthenticated, authenticate);

export default router;