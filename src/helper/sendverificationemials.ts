import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponce } from "@/types/Apiresponce";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponce> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystry Message | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "success to send verification email",
    };
  } catch (emailError) {
    console.log("error sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
