// server/utils/emailTemplates.js
function bookingConfirmationTemplate(booking) {
  return `
    <h2>Booking Confirmed ✅</h2>
    <p>Hi ${booking.user.name},</p>
    <p>Your booking for <strong>${booking.vehicle.name}</strong> has been confirmed.</p>
    <p><b>From:</b> ${booking.startDate}<br/>
    <b>To:</b> ${booking.endDate}</p>
    <p>Thank you for choosing us!</p>
  `;
}

function bookingCancellationTemplate(booking) {
  return `
    <h2>Booking Cancelled ❌</h2>
    <p>Hi ${booking.user.name},</p>
    <p>Your booking for <strong>${booking.vehicle.name}</strong> has been cancelled.</p>
  `;
}

module.exports = {
  bookingConfirmationTemplate,
  bookingCancellationTemplate
};
