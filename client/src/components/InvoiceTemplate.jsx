import { jwtDecode } from "jwt-decode";

function InvoiceTemplate({ payment }) {
  if (!payment || !payment.payment) return <p>Invalid payment data</p>;

  const { vehicle, startDate, endDate, totalPrice, payment: pay } = payment;

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

  const tax = pay?.tax || 0;
  const baseAmount = pay?.amount / 100 || 0;
  const grandTotal = baseAmount + tax;

  const handlePrint = () => {
    const invoiceWindow = window.open("", "_blank");
    const html = `
      <html>
        <head>
          <title>Rental Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .summary { margin-top: 20px; float: right; }
          </style>
        </head>
        <body>
          <h1>RENTAL INVOICE</h1>
          <p><strong>Invoice #:</strong> ${pay._id}</p>
          <p><strong>Date:</strong> ${new Date(pay.createdAt).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${user.name || "N/A"}</p>
          <p><strong>Vehicle:</strong> ${vehicle?.title || "N/A"}</p>

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
                <td>₹${baseAmount}</td>
                <td>${startDate ? new Date(startDate).toLocaleDateString() : "Invalid"}</td>
                <td>${endDate ? new Date(endDate).toLocaleDateString() : "Invalid"}</td>
                <td>₹${baseAmount}</td>
              </tr>
            </tbody>
          </table>

          <div class="summary">
            <p><strong>Subtotal:</strong> ₹${baseAmount}</p>
            <p><strong>Tax:</strong> ₹${tax}</p>
            <p><strong>Total Paid:</strong> ₹${grandTotal}</p>
          </div>

          <p style="margin-top: 80px; text-align: center;">THANK YOU FOR YOUR BUSINESS!</p>
        </body>
      </html>
    `;
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
    invoiceWindow.print();
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
