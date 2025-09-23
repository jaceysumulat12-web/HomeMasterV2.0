function signOut() {
  alert("Signed out successfully!");
  window.location.href = "index.html";
}

// Load products from localStorage
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

// Render cart with controls
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

// Checkout
function checkout() {
  if (cart.length === 0) return;

  alert("Checkout complete! Total: ₱" + document.getElementById("cartTotal").textContent);

  // Deduct stock
  cart.forEach(item => {
    const prod = products.find(p => p.code === item.code);
    if (prod) prod.stock -= item.qty;
  });

  // Save updated products
  localStorage.setItem("products", JSON.stringify(products));

  // Update visible stock in product list
  const list = document.getElementById("productsList").children;
  for (let div of list) {
    const code = div.querySelector("small").textContent.split(" - ")[0];
    const prod = products.find(p => p.code === code);
    if (prod) {
      div.querySelector("small").textContent = `${prod.code} - Stock: ${prod.stock}`;
    }
  }

  // Clear cart
  cart = [];
  renderCart();
}

// Search
document.getElementById("searchProducts").addEventListener("input", (e) => {
  renderProducts(e.target.value);
});

// --- Sync with Inventory instantly ---
window.addEventListener("storage", (event) => {
  if (event.key === "products") {
    products = JSON.parse(localStorage.getItem("products")) || [];
    renderProducts();
  }
});

// Init
renderProducts();
renderCart();
