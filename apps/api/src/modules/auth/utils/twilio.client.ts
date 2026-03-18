import twilio from "twilio";
import { env } from "../../../config/env";

export const twilioClient = twilio(
  env.twilio.sid,
  env.twilio.token
);