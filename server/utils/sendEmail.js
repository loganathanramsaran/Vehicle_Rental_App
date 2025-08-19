const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📨 Preparing to send email...");
    console.log("   To:", to);
    console.log("   Subject:", subject);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    console.log("✅ Transporter created successfully");

    const mailOptions = {
      from: `"Vehicle Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    console.log("📋 Mail options prepared:", mailOptions);

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent successfully!");
    console.log("   Message ID:", info.messageId);
    if (info.response) {
      console.log("   Server Response:", info.response);
    }

    return info;
  } catch (error) {
    console.error("❌ Email send failed!");
    console.error("   Error Name:", error.name);
    console.error("   Error Message:", error.message);
    if (error.response) {
      console.error("   Error Response:", error.response);
    }
    throw error;
  }
};

module.exports = sendEmail;
