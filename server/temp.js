require("dotenv").config();
const sendEmail = require("./utils/sendEmail"); // path to your updated sendEmail

(async () => {
  try {
    await sendEmail(
      "yourtestemail@gmail.com",
      "Test Email",
      "<p>This is a test email from Vehicle Rental App</p>"
    );
    console.log("✅ Test email sent successfully");
  } catch (err) {
    console.error("❌ Test email failed", err);
  }
})();
