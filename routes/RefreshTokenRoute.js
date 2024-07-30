import express from "express";

const router = express.Router();

import { getRefreshToken } from "../controllers/RefreshTokenController.js";

router.get("/", getRefreshToken);


export default router;
