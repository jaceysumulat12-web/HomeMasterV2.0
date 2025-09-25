function signOut() {
  alert("Signed out successfully!");
  window.location.href = "index.html";
}

// Load products
let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = [];

// Render products
function renderProducts(filter = "") {
  const list = document.getElementById("productsList");
  list.innerHTML = "";

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.code.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    list.innerHTML = "<p style='text-align:center;color:#666;'>No products found</p>";
    return;
  }

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product-item");
    div.innerHTML = `
      <div>
        <strong>${p.name}</strong><br>
        <small>${p.code} - Stock: ${p.stock}</small>
      </div>
      <span>₱${p.price.toFixed(2)}</span>
    `;
    div.onclick = () => addToCart(p);
    list.appendChild(div);
  });
}

// Add to cart
function addToCart(product) {
  const existing = cart.find(c => c.code === product.code);
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty++;
    } else {
      alert("No more stock available for " + product.name);
      return;
    }
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

// Render cart
function renderCart() {
  const cartDiv = document.getElementById("cartItems");
  cartDiv.innerHTML = "";
  if (cart.length === 0) {
    cartDiv.textContent = "Cart is empty";
    document.getElementById("checkoutBtn").disabled = true;
  } else {
    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <span>${item.name}</span>
        <div>
          <button onclick="decreaseQty(${index})">-</button>
          <span> ${item.qty} </span>
          <button onclick="increaseQty(${index})">+</button>
          <span>₱${(item.qty * item.price).toFixed(2)}</span>
          <button onclick="removeFromCart(${index})">x</button>
        </div>
      `;
      cartDiv.appendChild(div);
    });
    document.getElementById("checkoutBtn").disabled = false;
  }
  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("cartTotal").textContent = cart.reduce((sum, i) => sum + i.qty * i.price, 0).toFixed(2);
}

// Cart functions
function increaseQty(index) {
  const item = cart[index];
  const product = products.find(p => p.code === item.code);
  if (item.qty < product.stock) {
    item.qty++;
    renderCart();
  } else {
    alert("No more stock available for " + item.name);
  }
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// --- Printable Receipt ---
function printReceipt(sale) {
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

// Checkout
function checkout() {
  if (cart.length === 0) return;

  const totalAmount = parseFloat(document.getElementById("cartTotal").textContent);
  const date = new Date().toLocaleDateString();

  const sale = {
    id: "SALE-" + String(Date.now()).slice(-4),
    date: date,
    customer: "Walk-in",
    items: cart.map(item => ({
      name: item.name,
      code: item.code,
      qty: item.qty,
      price: item.price,
      total: item.qty * item.price
    })),
    total: totalAmount,
    payment: "Cash",
    cashier: "admin"
  };

  let salesReports = JSON.parse(localStorage.getItem("salesReports")) || [];
  salesReports.push(sale);
  localStorage.setItem("salesReports", JSON.stringify(salesReports));

  // ✅ Print receipt
  printReceipt(sale);

  // Deduct stock
  cart.forEach(item => {
    const prod = products.find(p => p.code === item.code);
    if (prod) prod.stock -= item.qty;
  });

  localStorage.setItem("products", JSON.stringify(products));

  // Update stock display
  const list = document.getElementById("productsList").children;
  for (let div of list) {
    const code = div.querySelector("small").textContent.split(" - ")[0];
    const prod = products.find(p => p.code === code);
    if (prod) {
      div.querySelector("small").textContent = `${prod.code} - Stock: ${prod.stock}`;
    }
  }

  cart = [];
  renderCart();
}

// Search
document.getElementById("searchProducts").addEventListener("input", (e) => {
  renderProducts(e.target.value);
});

// Sync with Inventory
window.addEventListener("storage", (event) => {
  if (event.key === "products") {
    products = JSON.parse(localStorage.getItem("products")) || [];
    renderProducts();
  }
});

// Init
renderProducts();
renderCart();
