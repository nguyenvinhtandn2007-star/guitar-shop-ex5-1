// State Management
const defaultCategories = [
  { id: 1, name: "Guitars" },
  { id: 2, name: "Basses" },
  { id: 3, name: "Drums" }
];

const defaultProducts = [
  { id: 1, categoryId: 1, code: "strat", name: "Fender Stratocaster", price: 699.00, image: "strat.svg" },
  { id: 2, categoryId: 1, code: "lespaul", name: "Gibson Les Paul", price: 1199.00, image: "strat.svg" },
  { id: 3, categoryId: 2, code: "precision", name: "Fender Precision Bass", price: 799.00, image: "strat.svg" }
];

let categories = JSON.parse(localStorage.getItem('gs_categories')) || defaultCategories;
let products = JSON.parse(localStorage.getItem('gs_products')) || defaultProducts;
let isImageRenamed = JSON.parse(localStorage.getItem('gs_img_renamed')) || false; // Step 4 Simulation State

let selectedManagerCategoryId = 1;
let selectedCatalogCategoryId = 1;

// Init Application
document.addEventListener('DOMContentLoaded', () => {
  renderManagerCategorySelect();
  renderManagerProducts();
  renderCategoryManagementTable();
  renderCatalogCategories();
  renderCatalogProducts();
  updateImageRenameBadge();
});

// Toast Helper
function showToast(message, type = "success") {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '✅' : '⚠️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Navigation Tabs
function switchTab(tab) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));

  if (tab === 'manager') {
    document.getElementById('btn-tab-manager').classList.add('active');
    document.getElementById('view-manager').classList.add('active');
  } else if (tab === 'catalog') {
    document.getElementById('btn-tab-catalog').classList.add('active');
    document.getElementById('view-catalog').classList.add('active');
    renderCatalogCategories();
    renderCatalogProducts();
  }
}

function switchManagerSubView(view) {
  if (view === 'products') {
    document.getElementById('manager-products-subview').style.display = 'block';
    document.getElementById('manager-categories-subview').style.display = 'none';
  } else if (view === 'categories') {
    document.getElementById('manager-products-subview').style.display = 'none';
    document.getElementById('manager-categories-subview').style.display = 'block';
    renderCategoryManagementTable();
  }
}

// --- PRODUCT MANAGER LOGIC ---
function renderManagerCategorySelect() {
  const managerSelect = document.getElementById('manager-category-select');
  const modalSelect = document.getElementById('add-product-category');
  
  const optionsHtml = categories.map(cat => 
    `<option value="${cat.id}" ${cat.id === selectedManagerCategoryId ? 'selected' : ''}>${cat.name}</option>`
  ).join('');

  managerSelect.innerHTML = optionsHtml;
  modalSelect.innerHTML = optionsHtml;
}

function renderManagerProducts() {
  const select = document.getElementById('manager-category-select');
  selectedManagerCategoryId = parseInt(select.value) || categories[0]?.id || 1;

  const filteredProducts = products.filter(p => p.categoryId === selectedManagerCategoryId);
  const tbody = document.getElementById('manager-products-table-body');

  if (filteredProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No products found in this category.</td></tr>`;
    return;
  }

  tbody.innerHTML = filteredProducts.map(p => `
    <tr>
      <td><span class="badge badge-purple">${p.code}</span></td>
      <td style="font-weight: 600; color: #fff;">${p.name}</td>
      <td style="color: var(--accent-emerald); font-weight: 700;">$${parseFloat(p.price).toFixed(2)}</td>
      <td>
        <button class="btn-danger" onclick="handleDeleteProduct(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function handleDeleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter(p => p.id !== productId);
    saveState();
    renderManagerProducts();
    showToast("Product deleted successfully");
  }
}

function openAddProductModal() {
  renderManagerCategorySelect();
  document.getElementById('add-product-modal').classList.add('active');
}

function closeAddProductModal() {
  document.getElementById('add-product-modal').classList.remove('active');
  document.getElementById('add-product-form').reset();
}

function handleAddProduct(event) {
  event.preventDefault();
  const categoryId = parseInt(document.getElementById('add-product-category').value);
  const code = document.getElementById('add-product-code').value.trim();
  const name = document.getElementById('add-product-name').value.trim();
  const price = parseFloat(document.getElementById('add-product-price').value);

  if (!code || !name || isNaN(price)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const newProduct = {
    id: Date.now(),
    categoryId: categoryId,
    code: code,
    name: name,
    price: price,
    image: `${code}.png`
  };

  products.push(newProduct);
  saveState();
  closeAddProductModal();
  renderManagerProducts();
  showToast(`Added product "${name}" to database!`);
}

// --- CATEGORY MANAGEMENT LOGIC (Exercise 5-1 Enhancement) ---
function renderCategoryManagementTable() {
  const tbody = document.getElementById('category-management-table-body');
  tbody.innerHTML = categories.map(cat => `
    <tr>
      <td><span style="color: var(--text-muted); font-family: monospace;">#${cat.id}</span></td>
      <td style="font-weight: 600; color: #fff;">${cat.name}</td>
      <td>
        <button class="btn-danger" onclick="handleDeleteCategory(${cat.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function handleAddCategory(event) {
  event.preventDefault();
  const input = document.getElementById('category-name-input');
  const name = input.value.trim();

  if (!name) return;

  const newCategory = {
    id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
    name: name
  };

  categories.push(newCategory);
  saveState();
  input.value = '';
  renderCategoryManagementTable();
  renderManagerCategorySelect();
  showToast(`Added category "${name}"`);
}

function handleDeleteCategory(categoryId) {
  // Check if products exist in category
  const productsInCategory = products.filter(p => p.categoryId === categoryId);
  if (productsInCategory.length > 0) {
    alert(`Cannot delete category because ${productsInCategory.length} product(s) still belong to it!`);
    return;
  }

  if (confirm("Are you sure you want to delete this category?")) {
    categories = categories.filter(c => c.id !== categoryId);
    saveState();
    renderCategoryManagementTable();
    renderManagerCategorySelect();
    showToast("Category deleted successfully");
  }
}

// --- PRODUCT CATALOG LOGIC ---
function renderCatalogCategories() {
  const list = document.getElementById('catalog-category-list');
  list.innerHTML = categories.map(cat => `
    <li class="category-item">
      <button class="category-btn ${cat.id === selectedCatalogCategoryId ? 'active' : ''}" onclick="selectCatalogCategory(${cat.id})">
        <span>${cat.name}</span>
        <span>›</span>
      </button>
    </li>
  `).join('');
}

function selectCatalogCategory(catId) {
  selectedCatalogCategoryId = catId;
  renderCatalogCategories();
  renderCatalogProducts();
  hideProductDetail();
}

function renderCatalogProducts() {
  const category = categories.find(c => c.id === selectedCatalogCategoryId) || categories[0];
  document.getElementById('catalog-category-title').innerText = category ? category.name : "Catalog";

  const filteredProducts = products.filter(p => p.categoryId === selectedCatalogCategoryId);
  const tbody = document.getElementById('catalog-products-table-body');

  if (filteredProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No products available in this category.</td></tr>`;
    return;
  }

  tbody.innerHTML = filteredProducts.map(p => `
    <tr>
      <td><span class="badge badge-purple">${p.code}</span></td>
      <td style="font-weight: 600; color: #fff;">${p.name}</td>
      <td style="color: var(--accent-emerald); font-weight: 700;">$${parseFloat(p.price).toFixed(2)}</td>
      <td>
        <button class="btn-view" onclick="viewProductDetail(${p.id})">View Details</button>
      </td>
    </tr>
  `).join('');
}

function viewProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const category = categories.find(c => c.id === product.categoryId);
  const listPrice = parseFloat(product.price);
  const discountPercent = 0.30;
  const discountAmount = listPrice * discountPercent;
  const yourPrice = listPrice - discountAmount;

  document.getElementById('detail-category-badge').innerText = category ? category.name : "Category";
  document.getElementById('detail-product-name').innerText = product.name;
  document.getElementById('detail-product-code').innerText = product.code;
  document.getElementById('detail-list-price').innerText = `$${listPrice.toFixed(2)}`;
  document.getElementById('detail-discount-amount').innerText = `-$${discountAmount.toFixed(2)}`;
  document.getElementById('detail-your-price').innerText = `$${yourPrice.toFixed(2)}`;

  // Handle Image Display & Exercise Step 3/4 simulation
  const imgContainer = document.getElementById('product-img-container');
  
  if (product.code === "test1" && !isImageRenamed) {
    // Step 3 error simulation: test1.png doesn't exist yet (file is named test.png in images folder)
    imgContainer.innerHTML = `
      <div class="image-broken-placeholder">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🖼️❌</div>
        <div style="font-weight: 700; color: #f87171; margin-bottom: 4px;">Image Not Found: test1.png</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">
          [Bài 5-1 Bước 3]: File hiện tại là <code>images/test.png</code>.<br>
          Bấm nút <strong>"Đổi tên test.png ➔ test1.png"</strong> ở thanh trên để khắc phục!
        </div>
      </div>
    `;
  } else {
    // Normal image or renamed test1.svg
    let imgSrc = `images/${product.image}`;
    if (product.code === "test1" && isImageRenamed) {
      imgSrc = `images/test1.svg`;
    }

    imgContainer.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" class="product-img" onerror="this.src='images/strat.svg'">
      <div style="margin-top: 10px; font-size: 0.8rem; color: var(--text-muted);">
        File: <code>${product.code === "test1" ? 'images/test1.png (test1.svg)' : imgSrc}</code>
      </div>
    `;
  }

  document.getElementById('catalog-list-view').style.display = 'none';
  document.getElementById('catalog-detail-view').style.display = 'block';
}

function hideProductDetail() {
  document.getElementById('catalog-list-view').style.display = 'block';
  document.getElementById('catalog-detail-view').style.display = 'none';
}

// --- EXERCISE STEP 4 SIMULATION: RENAME FILE ---
function toggleImageRenameSim() {
  isImageRenamed = !isImageRenamed;
  localStorage.setItem('gs_img_renamed', JSON.stringify(isImageRenamed));
  updateImageRenameBadge();

  if (isImageRenamed) {
    showToast("Đã đổi tên file: test.png ➔ test1.png (Bước 4 hoàn tất)");
  } else {
    showToast("Trả lại tên cũ: test1.png ➔ test.png");
  }

  // Refresh view if product detail is currently showing
  if (document.getElementById('catalog-detail-view').style.display === 'block') {
    const code = document.getElementById('detail-product-code').innerText;
    const currentProduct = products.find(p => p.code === code);
    if (currentProduct) viewProductDetail(currentProduct.id);
  }
}

function updateImageRenameBadge() {
  const badge = document.getElementById('img-status-badge');
  const desc = document.getElementById('ex-status-desc');

  if (isImageRenamed) {
    badge.className = 'badge badge-purple';
    badge.innerText = 'File: test1.png (Hiển thị tốt)';
    desc.innerText = '✅ Bước 4 hoàn thành: File test.png đã được đổi tên thành test1.png. Hình ảnh sản phẩm Test Product 2211 giờ đã hiển thị bình thường!';
  } else {
    badge.className = 'badge badge-pink';
    badge.innerText = 'File: test.png (Thiếu test1.png)';
    desc.innerText = '⚠️ Bài 5-1 Bước 3: Khi thêm "test1" (Test Product 2211), hình ảnh chưa hiển thị vì file tên là test.png. Hãy bấm nút bên phải để đổi tên!';
  }
}

function saveState() {
  localStorage.setItem('gs_categories', JSON.stringify(categories));
  localStorage.setItem('gs_products', JSON.stringify(products));
}
