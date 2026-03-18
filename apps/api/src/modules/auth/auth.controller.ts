import type { Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;

        await authService.sendOTP(phone);

        res.json({
            success: true,
            message: "OTP sent"
        });

    } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid request";
        res.status(500).json({ error: message });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { phone, code } = req.body;

        const data = await authService.verifyOTP(phone, code);

        res.json({
            success: true,
            ...data
        });

    } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        res.status(400).json({ error: message });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, phone, password } = req.body;

        const data = await authService.register(
            username,
            email,
            phone,
            password
        );

        res.json({
            success: true,
            user: data
        });

    } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid register";
        res.status(400).json({
            success: false,
            error: message
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const data = await authService.login(email, password);

        res.json({
            success: true,
            ...data
        });

    } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid login";
        res.status(400).json({ error: message });
    }
};