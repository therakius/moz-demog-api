import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWD,
  },
});



export async function sendEmail(recipient, key) {
    const info = await transporter.sendMail({
        from: `"Moz Demog API" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: "Your API Key",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            <h2>Welcome to Moz Demographic API 🎉</h2>

            <p>Hello,</p>

            <p>
                Your API key has been successfully generated. You can start using it
                immediately to access our services.
            </p>

            <p><strong>Your API Key:</strong></p>

            <div style="
                background: #f4f4f4;
                padding: 12px;
                border-radius: 6px;
                font-family: monospace;
                font-size: 14px;
                word-break: break-all;
            ">
                ${key}
            </div>

            <p style="margin-top: 16px;">
                ⚠️ Keep this key secure and do not share it publicly. If you believe
                it has been compromised, revoke it and generate a new one immediately.
            </p>

            <p>
                If you have any questions, feel free to reply to this email.
            </p>

            <p>
                Best regards,<br />
                <strong>Moz Demographic API Team</strong>
            </p>
            </div>

            `
    })

    return info
}


sendEmail("gaspardc116@gmail.com", "GADTEST12345")