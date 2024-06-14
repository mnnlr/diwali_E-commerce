import { Router } from "express";
const router = Router();


import registerUser from "../controller/registerController.js";

router.route('/').post(registerUser);


export default router;