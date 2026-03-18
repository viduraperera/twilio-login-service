import dotenv from "dotenv";

dotenv.config();

export const env = {
    port: process.env.PORT || 5000,
    twilio: {
        sid: process.env.TWILIO_ACCOUNT_SID!,
        token: process.env.TWILIO_AUTH_TOKEN!,
        verifyServiceId: process.env.TWILIO_VERIFY_SERVICE_ID!,
        mongoUrl: process.env.MONGO_URI!
    },
    jwtSecret: process.env.JWT_SECRET!
};