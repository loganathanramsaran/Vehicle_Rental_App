import { jwtDecode } from "jwt-decode";

function InvoiceTemplate({ payment }) {
  if (!payment) return <p>Invalid payment data</p>;

  // Vehicle name
  const vehicleName = payment.vehicleId?.name || "N/A";

  // Dates come from populated booking
  const startDate = payment.bookingId?.startDate || null;
  const endDate = payment.bookingId?.endDate || null;

  // Payment info
  const pay = payment;

  // Decode user from token
  let user = { name: "N/A" };
  const token = localStorage.getItem("token");
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      console.error("Token decode failed", err);
    }
  }

  // Amounts
  const baseAmount = pay?.amount || 0;
  const tax = pay?.tax || 0;
  const grandTotal = baseAmount + tax;

  // Short invoice ID
  const invoiceId = pay?._id
    ? pay._id.slice(-6).toUpperCase()
    : "N/A";

  // Currency formatter
  const formatCurrency = (val) =>
    val.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  const handlePrint = () => {
    const invoiceWindow = window.open("", "_blank");
    const html = `
      <html>
        <head>
          <title>Rental Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .header img { max-width: 120px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .summary { margin-top: 20px; float: right; }
            .footer { margin-top: 80px; text-align: center; font-size: 14px; color: #555; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://dummyimage.com/200x60/000/fff&text=Your+Logo" alt="Company Logo" />
            <h1>RENTAL INVOICE</h1>
          </div>

          <p><strong>Invoice #:</strong> ${invoiceId}</p>
          <p><strong>Date:</strong> ${pay?.createdAt ? new Date(pay.createdAt).toLocaleDateString() : "-"}</p>
          <p><strong>Customer:</strong> ${user.name || "N/A"}</p>
          <p><strong>Vehicle:</strong> ${vehicleName}</p>
          <p><strong>Payment ID:</strong> ${pay?.razorpayPaymentId || "N/A"}</p>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Car Rental</td>
                <td>1</td>
                <td>${formatCurrency(baseAmount)}</td>
                <td>${startDate ? new Date(startDate).toLocaleDateString() : "-"}</td>
                <td>${endDate ? new Date(endDate).toLocaleDateString() : "-"}</td>
                <td>${formatCurrency(baseAmount)}</td>
              </tr>
            </tbody>
          </table>

          <div class="summary">
            <p><strong>Subtotal:</strong> ${formatCurrency(baseAmount)}</p>
            <p><strong>Tax:</strong> ${formatCurrency(tax)}</p>
            <p><strong>Total Paid:</strong> ${formatCurrency(grandTotal)}</p>
          </div>

          <p class="footer">THANK YOU FOR YOUR BUSINESS!</p>
        </body>
      </html>
    `;
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
    invoiceWindow.print();
    invoiceWindow.onafterprint = () => invoiceWindow.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
      disabled={payment.status === "cancelled"}
    >
      Invoice
    </button>
  );
}

export default InvoiceTemplate;
