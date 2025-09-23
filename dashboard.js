const categoryFilter = document.getElementById("categoryFilter");
function signOut() {
  alert("Signed out successfully!");
  window.location.href = "index.html";
}

// Modal controls
const modal = document.getElementById("productModal");
const form = document.getElementById("productForm");
const tableBody = document.querySelector("#productsTable tbody");
const modalTitle = document.getElementById("modalTitle");
const submitBtn = document.getElementById("submitBtn");
let isEditing = false;
let editingRow = null;

// Load products from localStorage
let products = JSON.parse(localStorage.getItem("products")) || [];

// Open modal
function openModal(editing = false, row = null) {
  modal.style.display = "flex";
  isEditing = editing;
  editingRow = row;
  if (isEditing) {
    modalTitle.textContent = "Update Product";
    submitBtn.textContent = "Update";
  } else {
    modalTitle.textContent = "Add Product";
    submitBtn.textContent = "Add";
    const filter = document.getElementById("categoryFilter");
    const modalCategory = document.getElementById("category");
    if (filter && modalCategory && filter.value) {
      modalCategory.value = filter.value;
    } else if (modalCategory) {
      modalCategory.value = "";
    }
  }
}

// Close modal
function closeModal() {
  modal.style.display = "none";
  isEditing = false;
  editingRow = null;
  modalTitle.textContent = "Add Product";
  submitBtn.textContent = "Add";
  form.reset(); // Always clear form when closing modal
}

// Save products to localStorage
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Render products into the table
function renderProducts() {
  tableBody.innerHTML = "";
  if (products.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="empty">No products found.</td></tr>`;
  } else {
    products.forEach((p, index) => {
      const row = document.createElement("tr");
      const { name, code: sku, category, stock, price } = p;
      row.innerHTML = `
        <td>${name}</td>
        <td>${sku}</td>
        <td>${category}</td>
        <td>${stock}</td>
        <td>₱${price.toFixed(2)}</td>
        <td class="${stock === 0 ? 'low-stock' : (stock <= 10 ? 'low-stock' : '')}">${stock === 0 ? "Out of Stock" : (stock <= 10 ? "Low Stock" : "In Stock")}</td>
        <td>
          <button onclick="editRow(this)">Edit</button>
          <button onclick="deleteRow(this)">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  updateStats();
}

// Add or Update product
form.addEventListener("submit", function(e) {
  e.preventDefault();

  try {
    const name = document.getElementById("productName").value;
    const code = document.getElementById("code").value;
    const category = document.getElementById("category").value;
    const stock = parseInt(document.getElementById("stock").value);
    const price = parseFloat(document.getElementById("price").value);

    if (isEditing && editingRow !== null) {
      products[editingRow] = { name, code, category, stock, price };
    } else {
      products.push({ name, code, category, stock, price });
      form.reset(); // Always reset after adding
    }

    saveProducts();
    renderProducts();
  } catch (err) {
    console.error("Error submitting product form:", err);
  }
  closeModal();
});

// Edit product
function editRow(button) {
  const row = button.closest("tr");
  const index = Array.from(tableBody.children).indexOf(row);
  const product = products[index];
  document.getElementById("productName").value = product.name;
  document.getElementById("code").value = product.code;
  document.getElementById("category").value = product.category;
  document.getElementById("stock").value = product.stock;
  document.getElementById("price").value = product.price;
  openModal(true, index);
}

// Delete product
function deleteRow(index) {
  products.splice(index, 1);
  saveProducts();
  renderProducts();
}

// --- Category Filter ---
function filterProducts() {
  const filterValue = categoryFilter.value;
  const rows = tableBody.querySelectorAll("tr");
  let anyVisible = false;
  rows.forEach(row => {
    if (row.classList.contains("empty")) return;
    const cat = row.cells[2].textContent;
    if (!filterValue || cat === filterValue) {
      row.style.display = "";
      anyVisible = true;
    } else {
      row.style.display = "none";
    }
  });

  const emptyRow = tableBody.querySelector(".empty");
  if (!anyVisible) {
    if (!emptyRow) {
      const tr = document.createElement("tr");
      tr.innerHTML = '<td colspan="7" class="empty">No products found.</td>';
      tableBody.appendChild(tr);
    }
  } else {
    if (emptyRow) emptyRow.parentElement.remove();
  }
}
categoryFilter.addEventListener("change", filterProducts);

// --- Search Products ---
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searachForm");

searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  searchProducts();
});
searchInput.addEventListener("input", function() {
  searchProducts();
});

function searchProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const rows = tableBody.querySelectorAll("tr");
  let anyVisible = false;
  rows.forEach(row => {
    if (row.classList.contains("empty")) return;
    const name = row.cells[0].textContent.toLowerCase();
    const code = row.cells[1].textContent.toLowerCase();
    const category = row.cells[2].textContent.toLowerCase();
    if (!query || name.includes(query) || code.includes(query) || category.includes(query)) {
      row.style.display = "";
      anyVisible = true;
    } else {
      row.style.display = "none";
    }
  });
  const emptyRow = tableBody.querySelector(".empty");
  if (anyVisible) {
    if (emptyRow) emptyRow.parentElement.remove();
  } else {
    if (!emptyRow) {
      const tr = document.createElement("tr");
      tr.innerHTML = '<td colspan="7" class="empty">No products found.</td>';
      tableBody.appendChild(tr);
    }
  }
}

// Update stats
function updateStats() {
  let totalProducts = 0, lowStock = 0, inventoryValue = 0;
  const categories = new Set();

  products.forEach(p => {
    totalProducts++;
    if (p.stock <= 10) lowStock++;
    inventoryValue += p.price * p.stock;
    categories.add(p.category);
  });

  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("lowStock").textContent = lowStock;
  document.getElementById("inventoryValue").textContent = `₱${inventoryValue.toFixed(2)}`;
  document.getElementById("uniqueCategories").textContent = categories.size;
}

// Initial render
renderProducts();
updateStats();
