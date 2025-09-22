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
    // Set modal category to filter value if not editing
    const filter = document.getElementById("categoryFilter");
    const modalCategory = document.getElementById("category");
    if (filter && modalCategory && filter.value) {
      modalCategory.value = filter.value;
    } else if (modalCategory) {
      modalCategory.value = "";
    }
  }
}

function closeModal() {
  modal.style.display = "none";
  isEditing = false;
  editingRow = null;
  modalTitle.textContent = "Add Product";
  submitBtn.textContent = "Add";
}

// Add product
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const sku = document.getElementById("code").value;
  const category = document.getElementById("category").value;
  const stock = parseInt(document.getElementById("stock").value);
  const price = parseFloat(document.getElementById("price").value);

  // Remove "No products found" if exists (only when adding a product)
  const emptyRow = tableBody.querySelector(".empty");
  if (emptyRow && (!isEditing || !editingRow)) emptyRow.parentElement.remove();

  if (isEditing && editingRow) {
    editingRow.innerHTML = `
      <td>${name}</td>
      <td>${sku}</td>
      <td>${category}</td>
      <td>${stock}</td>
      <td>₱${price.toFixed(2)}</td>
      <td>${stock > 0 ? "In Stock" : "Out of Stock"}</td>
      <td>
        <button onclick="editRow(this)">Edit</button>
        <button onclick="deleteRow(this)">Delete</button>
      </td>
    `;
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${sku}</td>
      <td>${category}</td>
      <td>${stock}</td>
      <td>₱${price.toFixed(2)}</td>
      <td>${stock > 0 ? "In Stock" : "Out of Stock"}</td>
      <td>
        <button onclick="editRow(this)">Edit</button>
        <button onclick="deleteRow(this)">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }

  filterProducts();
// Filter products by category
function filterProducts() {
  const filterValue = categoryFilter.value;
  const rows = tableBody.querySelectorAll("tr");
  let anyVisible = false;
  let hasCategoryProduct = false;
  rows.forEach(row => {
    if (row.classList.contains("empty")) return;
    const cat = row.cells[2].textContent;
    if (!filterValue || cat === filterValue) {
      hasCategoryProduct = true;
      row.style.display = "";
      anyVisible = true;
    } else {
      row.style.display = "none";
    }
  });
  // Show empty message only if there are literally no products in the selected category
  const emptyRow = tableBody.querySelector(".empty");
  if (!hasCategoryProduct) {
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

  // Reset and close modal
  form.reset();
  closeModal();

  // Update stats
  updateStats();
});

// Edit product
function editRow(button) {
  const row = button.closest("tr");
  const cells = row.cells;
  document.getElementById("productName").value = cells[0].textContent;
  document.getElementById("code").value = cells[1].textContent;
  document.getElementById("category").value = cells[2].textContent;
  document.getElementById("stock").value = cells[3].textContent;
  document.getElementById("price").value = cells[4].textContent.replace("₱", "");
  openModal(true, row);
}

// Delete product
function deleteRow(button) {
  button.closest("tr").remove();
  if (tableBody.rows.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="empty">No products found.</td></tr>`;
  }
  updateStats();
}

// Update product info
function updateStats() {
  const rows = tableBody.querySelectorAll("tr");
  let totalProducts = 0, lowStock = 0, inventoryValue = 0;
  const categories = new Set();

  rows.forEach(row => {
    if (!row.classList.contains("empty")) {
      totalProducts++;
      const stock = parseInt(row.cells[3].textContent);
      const price = parseFloat(row.cells[4].textContent.replace("₱",""));
      const category = row.cells[2].textContent;

      if (stock < 5) lowStock++;
      inventoryValue += stock * price;
      categories.add(category);
    }
  });

  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("lowStock").textContent = lowStock;
  document.getElementById("inventoryValue").textContent = "₱" + inventoryValue.toFixed(2);
  document.getElementById("categoriesCount").textContent = categories.size;
}
