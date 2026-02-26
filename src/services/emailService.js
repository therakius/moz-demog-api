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

let message


export async function sendEmail(recipient, subject, key) {

    if (subject === 'Your API Key') {
        message = `
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
    } else if (subject === "Account Created Successfully") {
        message = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            <h2>Welcome to Moz Demographic API 🎉</h2>

            <p>Hello,</p>

            <p>
                Your account has been created successfully.
            </p>

            <p> you will receive an email with your api_key in moments</p>

            <p style="margin-top: 16px;">
                ⚠️ lease make sure to keep the key secure and do not share it publicly. If you believe
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
    } else if (subject === "Reset password instructions") {
        message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            
            <p>Hello,</p>

            <p>
                If you did not request a password reset, please ignore this email.
                <br><br>
                Otherwise, click the link below to reset your password:
            </p>

            <div style="
                padding: 0
                border-radius: 6px;
                text-align: left;
                width: fit-content;
            ">
                <a 
                    href="https://moz-demog-api.vercel.app/auth/reset-password?token=${encodeURIComponent(key)}"
                    style="
                        display: inline-block;
                        padding: 10px 18px;
                        background-color: #2563eb;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    "
                >
                    Reset Password
                </a>
            </div>

            <p style="margin-top: 20px;">
                If you have any questions, feel free to reply to this email.
            </p>

            <p>
                Best regards,<br />
                <strong>Moz Demographic API Team</strong>
            </p>
        </div>
        `
    } else if(subject === 'Password reseted successfully') {
        message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
                
                <p>Hello,</p>

                <p>
                    Your password was reseted successfully!
                    <br><br>
                    You can now use our services without any friction.
                </p>

                <p style="margin-top: 20px;">
                    If you have any questions, feel free to reply to this email.
                </p>

                <p>
                    Best regards,<br />
                    <strong>Moz Demographic API Team</strong>
                </p>
            </div>    
        
        `
    }
    console.log("sending email to " + recipient + ".")

    const info = await transporter.sendMail({
        from: `"Moz Demog API" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: subject,
        html: message 
    })


    if (info.accepted.length > 0 ) {
        console.log("message sent successfully.")
    }
    return info
}