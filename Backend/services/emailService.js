import nodemailer from "nodemailer";
import { format } from "date-fns";

let transporter;

const initializeTransporter = async () => {
  // Configure production transporter (Gmail SMTP)
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true", // true for port 465, false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Optional: verify connection configuration
  try {
    await transporter.verify();
    console.log("✅ Email transporter is ready");
  } catch (error) {
    console.error("❌ Email transporter configuration failed:", error);
  }
};

await initializeTransporter();

export const sendRegistrationEmail = async (userEmail, event) => {
  try {
    const eventDate = format(new Date(event.date), "PPP");
    const eventTime = format(new Date(event.date), "p");

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Event Registration System" <no-reply@example.com>',
      to: userEmail,
      subject: `Registration Confirmation: ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Registration Confirmation</h2>
          <p>Thank you for registering for the following event:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${event.title}</h3>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${eventTime}</p>
            <p><strong>Location:</strong> ${event.location}</p>
          </div>
          <p>We look forward to seeing you there!</p>
          <p>If you have any questions or need to cancel your registration, please contact us.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Registration email sent:", info.messageId);
    console.log("🔧 EMAIL CONFIG:", {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      user: process.env.EMAIL_USER,
    });
    
    return info;
  } catch (error) {
    console.error("❌ Error sending registration email:", error);
  }
};



export const sendPasswordResetEmail = async (userEmail, resetUrl) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Event Registration System" <events@example.com>',
      to: userEmail,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>You requested a password reset for your account.</p>
          <p>Please click the link below to reset your password. This link is valid for 1 hour.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3f51b5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you did not request this, please ignore the email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Password reset email sent:", info.messageId)

    if (nodemailer.getTestMessageUrl(info)) {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info))
    }

    return info
  } catch (error) {
    console.error("Error sending password reset email:", error)
  }
}

