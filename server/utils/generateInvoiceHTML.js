// utils/generateInvoiceHTML.js
module.exports = function generateInvoiceHTML({ booking, payment, user, vehicle, status }) {
  const bookingDate = booking?.createdAt
    ? new Date(booking.createdAt).toLocaleString()
    : "N/A";

  const paymentDate =
    payment?.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A";

  return `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: #f9f9f9;
          color: #333;
        }
        .invoice-container {
          max-width: 700px;
          margin: 30px auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          overflow: hidden;
          padding: 20px 40px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #eee;
          padding-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          color: #2c3e50;
        }
        .status {
          margin-top: 8px;
          font-weight: bold;
          color: ${status === "Cancelled" ? "#e74c3c" : "#27ae60"};
        }
        .section {
          margin: 20px 0;
        }
        .section h2 {
          font-size: 18px;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          color: #34495e;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td, th {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 13px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <h1>GoRent Invoice</h1>
          <p class="status">Status: ${status}</p>
        </div>

        <div class="section">
          <h2>Customer Details</h2>
          <table>
            <tr><th>Name</th><td>${user?.name || "N/A"}</td></tr>
            <tr><th>Email</th><td>${user?.email || "N/A"}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Vehicle Details</h2>
          <table>
            <tr><th>Vehicle Name</th><td>${vehicle?.name || "N/A"}</td></tr>
            <tr><th>Type</th><td>${vehicle?.type || "N/A"}</td></tr>
            <tr><th>Description</th><td>${vehicle?.description || "N/A"}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Booking Details</h2>
          <table>
            <tr><th>Booking ID</th><td>${booking?._id || "N/A"}</td></tr>
            <tr><th>From</th><td>${booking?.startDate ? new Date(booking.startDate).toLocaleDateString() : "N/A"}</td></tr>
            <tr><th>To</th><td>${booking?.endDate ? new Date(booking.endDate).toLocaleDateString() : "N/A"}</td></tr>
            <tr><th>Created At</th><td>${bookingDate}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Payment Details</h2>
          <table>
            <tr><th>Payment ID</th><td>${payment?.razorpayPaymentId || "N/A"}</td></tr>
            <tr><th>Order ID</th><td>${payment?.razorpayOrderId || "N/A"}</td></tr>
            <tr><th>Amount</th><td>₹${(booking?.totalPrice || 0).toFixed(2)}</td></tr>
            <tr><th>Payment Date</th><td>${paymentDate}</td></tr>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for booking with <strong>GoRent</strong> 🚗</p>
          <p>This is a system-generated invoice.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};
