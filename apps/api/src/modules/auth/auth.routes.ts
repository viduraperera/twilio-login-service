import { Router } from "express";
import { login, register, sendOTP, verifyOTP } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;