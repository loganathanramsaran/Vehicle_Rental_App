const cron = require("node-cron");
const Booking = require("./models/Booking");
const User = require("./models/User");
const Vehicle = require("./models/Vehicle");
const sendEmail = require("./utils/sendEmail");

const scheduleReminders = () => {
  // Runs every day at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(tomorrow.getDate() + 1);

    const bookings = await Booking.find({
      startDate: { $gte: tomorrow, $lt: dayAfter },
    }).populate("user vehicle");

    for (const booking of bookings) {
      await sendEmail({
        to: booking.user.email,
        subject: "⏰ Booking Reminder",
        html: `
          <h2>Reminder: Upcoming Booking</h2>
          <p>Hi ${booking.user.name},</p>
          <p>This is a reminder for your booking of <strong>${booking.vehicle.title}</strong> starting <strong>${new Date(booking.startDate).toDateString()}</strong>.</p>
          <p>Total: ₹${booking.totalPrice}</p>
          <br/>
          <p>See you soon!</p>
        `,
      });
    }
  });
};

module.exports = scheduleReminders;
