import { twilioClient } from "./utils/twilio.client";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

export class AuthService {

    async sendOTP(phone: string) {
        return await twilioClient.verify.v2
            .services(env.twilio.verifyServiceId)
            .verifications.create({
                to: phone,
                channel: "sms"
            });
    }

    async verifyOTP(phone: string, code: string) {
        const result = await twilioClient.verify.v2
            .services(env.twilio.verifyServiceId)
            .verificationChecks.create({
                to: phone,
                code
            });

        if (result.status !== "approved") {
            throw new Error("Invalid OTP");
        }

        const user = await User.findOne({ phone });

        if (!user) {
            throw new Error("User not found");
        }

        user.isPhoneVerified = true;
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            env.jwtSecret,
            { expiresIn: "1h" }
        );

        return { token };
    }

    // 📧 Register
    async register(
        username: string,
        email: string,
        phone: string,
        password: string
    ) {

        // 1. Check existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        const user = await User.create({
            username,
            email,
            phone,
            password: hashedPassword,
            isPhoneVerified: false
        });

        return {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            isPhoneVerified: user.isPhoneVerified
        };
    }

    // 🔑 Login
    async login(email: string, password: string) {
        const user = await User.findOne({ email });

        if (!user || !user.password) {
            throw new Error("Invalid credentials");
        }
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        // 🚨 First-time login → OTP required
        if (!user.isPhoneVerified) {
            await this.sendOTP(user.phone);

            return {
                requiresOTP: true,
                message: "OTP sent"
            };
        }

        // ✅ Normal login
        const token = jwt.sign(
            { userId: user._id },
            env.jwtSecret,
            { expiresIn: "1h" }
        );

        return { token };
    }
}