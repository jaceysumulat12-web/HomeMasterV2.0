function signOut() {
  alert("Signed out successfully!");
  window.location.href = "index.html";
}

// Load sales reports
let salesReports = JSON.parse(localStorage.getItem("salesReports")) || [];

const salesTableBody = document.getElementById("salesTableBody");

// --- Render Reports ---
function renderReports(filter = "all") {
  let filtered = salesReports;

  if (filter === "today") {
    const today = new Date().toLocaleDateString();
    filtered = salesReports.filter(s => s.date === today);
  }

  const totalSales = filtered.length;
  const totalRevenue = filtered.reduce((sum, s) => sum + s.total, 0);
  document.getElementById("totalSales").textContent = totalSales;
  document.getElementById("totalRevenue").textContent = "₱" + totalRevenue.toFixed(2);
  document.getElementById("todaysSales").textContent = salesReports.filter(s => s.date === new Date().toLocaleDateString()).length;

  salesTableBody.innerHTML = "";
  if (filtered.length === 0) {
    salesTableBody.innerHTML = `<tr><td colspan="7" class="empty">No sales found.</td></tr>`;
  } else {
    filtered.forEach((sale, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${sale.id}</td>
        <td>${sale.date}</td>
        <td>${sale.customer}</td>
        <td>₱${sale.total.toFixed(2)}</td>
        <td>${sale.payment}</td>
        <td>${sale.cashier}</td>
        <td>
          <button onclick="toggleDetails(${idx})">View</button>
          <button onclick="printReceipt(${idx})">Reprint</button>
        </td>
      `;
      salesTableBody.appendChild(row);

      // Details row
      const detailRow = document.createElement("tr");
      detailRow.id = "details-" + idx;
      detailRow.style.display = "none";
      detailRow.innerHTML = `
        <td colspan="7">
          <table class="inner-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Code</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${sale.items.map(i => `
                <tr>
                  <td>${i.name}</td>
                  <td>${i.code}</td>
                  <td>${i.qty}</td>
                  <td>₱${i.price.toFixed(2)}</td>
                  <td>₱${i.total.toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </td>
      `;
      salesTableBody.appendChild(detailRow);
    });
  }
}

function toggleDetails(idx) {
  const row = document.getElementById("details-" + idx);
  row.style.display = row.style.display === "none" ? "table-row" : "none";
}

// --- Reprint Receipt ---
function printReceipt(idx) {
  const sale = salesReports[idx];
  let receiptWindow = window.open("", "PRINT", "height=600,width=400");

  receiptWindow.document.write(`
    <html>
    <head>
      <title>Receipt - ${sale.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2, h3 { text-align: center; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px; }
        th { background: #f5f5f5; }
        .total { font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <h2>HomeMaster Direct</h2>
      <h3>Official Receipt</h3>
      <p><strong>Sale ID:</strong> ${sale.id}<br>
         <strong>Date:</strong> ${sale.date}<br>
         <strong>Cashier:</strong> ${sale.cashier}<br>
         <strong>Customer:</strong> ${sale.customer}</p>
      
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${sale.items.map(i => `
            <tr>
              <td>${i.name}</td>
              <td>${i.qty}</td>
              <td>₱${i.price.toFixed(2)}</td>
              <td>₱${i.total.toFixed(2)}</td>
            </tr>
          `).join("")}
          <tr class="total">
            <td colspan="3">Grand Total</td>
            <td>₱${sale.total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <p>Thank you for your purchase!<br>Powered by HomeMaster Direct</p>
      </div>
    </body>
    </html>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();
  receiptWindow.close();
}

// --- Download All Sales CSV ---
function downloadReport() {
  if (salesReports.length === 0) {
    alert("No sales data available to download.");
    return;
  }

  let csv = "Sale ID,Date,Customer,Product,Code,Qty,Price,Total,Sale Total,Payment,Cashier\n";

  salesReports.forEach(sale => {
    sale.items.forEach(item => {
      csv += `${sale.id},${sale.date},${sale.customer},${item.name},${item.code},${item.qty},${item.price},${item.total},${sale.total},${sale.payment},${sale.cashier}\n`;
    });
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "sales_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- Monthly Summary ---
function getMonthlySummary() {
  let summary = {};

  salesReports.forEach(sale => {
    let d = new Date(sale.date);
    let monthKey = d.toLocaleString("default", { month: "long", year: "numeric" });

    if (!summary[monthKey]) {
      summary[monthKey] = { totalSales: 0, totalRevenue: 0, dates: [] };
    }

    summary[monthKey].totalSales++;
    summary[monthKey].totalRevenue += sale.total;
    if (!summary[monthKey].dates.includes(sale.date)) {
      summary[monthKey].dates.push(sale.date);
    }
  });

  return summary;
}

function renderMonthlySummary() {
  const monthlySummaryBody = document.getElementById("monthlySummaryBody");
  const summary = getMonthlySummary();

  monthlySummaryBody.innerHTML = "";
  const months = Object.keys(summary);

  if (months.length === 0) {
    monthlySummaryBody.innerHTML = `<tr><td colspan="4" class="empty">No sales found.</td></tr>`;
    return;
  }

  months.forEach(month => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${month}</td>
      <td>${summary[month].totalSales}</td>
      <td>₱${summary[month].totalRevenue.toFixed(2)}</td>
      <td>${summary[month].dates.join(", ")}</td>
    `;
    monthlySummaryBody.appendChild(row);
  });
}

function downloadMonthlyReport() {
  const summary = getMonthlySummary();
  const months = Object.keys(summary);

  if (months.length === 0) {
    alert("No monthly sales data to download.");
    return;
  }

  let csv = "Month,Total Sales,Total Revenue,Sales Dates\n";

  months.forEach(month => {
    csv += `${month},${summary[month].totalSales},${summary[month].totalRevenue.toFixed(2)},"${summary[month].dates.join(" | ")}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "monthly_sales_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Bind buttons
document.getElementById("timeFilter").addEventListener("change", function() {
  renderReports(this.value);
});
document.getElementById("downloadReportBtn").addEventListener("click", downloadReport);
document.getElementById("downloadMonthlyBtn").addEventListener("click", downloadMonthlyReport);

// Init
renderReports();
renderMonthlySummary();
