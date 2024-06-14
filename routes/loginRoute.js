import { Router } from "express";
const router = Router();


import loginUser from "../controller/loginController.js";

router.route('/').post(loginUser);


export default router;