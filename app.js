const STORAGE_KEY = 'velas-products';
const AUTH_STORAGE_KEY = 'velas-admin-auth';
const ADMIN_USERNAME = 'judith';
const ADMIN_PASSWORD = 'admin';
const CATALOG_PAGE_SIZE = 4;

const CATEGORY_LABELS = {
  tortas: 'Tortas',
  'velas-toppers': 'Velas y toppers'
};

const defaultProducts = [
  { id: crypto.randomUUID(), category: 'tortas', name: 'Torta Red Velvet', price: 32, description: 'Bizcocho rojo aterciopelado con frosting de queso crema.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'tortas', name: 'Torta de Chocolate', price: 28, description: 'Capas de chocolate intenso con relleno de ganache.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'tortas', name: 'Cheesecake de Maracuyá', price: 30, description: 'Cremoso cheesecake con cobertura de maracuyá.', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'tortas', name: 'Torta Selva Negra', price: 34, description: 'Chocolate, crema chantilly y cerezas.', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'tortas', name: 'Torta Tres Leches', price: 29, description: 'Bizcocho suave bañado en mezcla de tres leches.', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'tortas', name: 'Torta de Vainilla y Fresas', price: 31, description: 'Capas de vainilla, crema y fresas frescas.', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80' },

  { id: crypto.randomUUID(), category: 'velas-toppers', name: 'Topper Feliz Cumple', price: 6, description: 'Topper acrílico dorado para tortas de cumpleaños.', image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'velas-toppers', name: 'Set de Velas Metalizadas', price: 5, description: 'Pack de velas premium en tonos dorados y rosados.', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'velas-toppers', name: 'Vela Numérica 1-9', price: 4, description: 'Velas numéricas individuales con brillo.', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'velas-toppers', name: 'Topper Personalizado', price: 12, description: 'Topper con nombre en acrílico espejo.', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'velas-toppers', name: 'Set Velas Arcoíris', price: 7, description: 'Set colorido ideal para fiestas infantiles.', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80' },
  { id: crypto.randomUUID(), category: 'velas-toppers', name: 'Mini Topper Corazón', price: 5, description: 'Topper decorativo pequeño para cupcakes y tortas.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' }
];

const state = {
  products: loadProducts(),
  authenticated: readAuthState(),
  catalogView: {
    tortas: { page: 0, showAll: false },
    'velas-toppers': { page: 0, showAll: false }
  }
};

const cakesCatalog = document.getElementById('catalog-cakes');
const accessoriesCatalog = document.getElementById('catalog-accessories');
const cakesControls = document.getElementById('controls-tortas');
const accessoriesControls = document.getElementById('controls-velas-toppers');
const adminList = document.getElementById('admin-list');
const form = document.getElementById('cake-form');
const idField = document.getElementById('cake-id');
const categoryField = document.getElementById('cake-category');
const nameField = document.getElementById('cake-name');
const priceField = document.getElementById('cake-price');
const descriptionField = document.getElementById('cake-description');
const imageField = document.getElementById('cake-image');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const cardTemplate = document.getElementById('cake-card-template');

const authSection = document.getElementById('auth-section');
const adminContent = document.getElementById('admin-content');
const loginForm = document.getElementById('login-form');
const loginUserField = document.getElementById('login-username');
const loginPasswordField = document.getElementById('login-password');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

renderCatalog();
renderAdminView();

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = loginUserField.value.trim().toLowerCase();
    const password = loginPasswordField.value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      state.authenticated = true;
      persistAuthState(true);
      loginError.hidden = true;
      loginForm.reset();
      renderAdminView();
      return;
    }

    state.authenticated = false;
    persistAuthState(false);
    loginError.hidden = false;
  });
}

if (loginUserField) loginUserField.addEventListener('input', () => (loginError.hidden = true));
if (loginPasswordField) loginPasswordField.addEventListener('input', () => (loginError.hidden = true));

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    state.authenticated = false;
    persistAuthState(false);
    renderAdminView();
  });
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.authenticated) return;

    const imageSource = await resolveImageSource();
    const productData = {
      id: idField.value || crypto.randomUUID(),
      category: categoryField.value,
      name: nameField.value.trim(),
      price: Number(priceField.value),
      description: descriptionField.value.trim() || 'Sin descripción.',
      image: imageSource
    };

    if (!productData.name || !productData.image || !CATEGORY_LABELS[productData.category] || Number.isNaN(productData.price) || productData.price <= 0) {
      return;
    }

    const existingIndex = state.products.findIndex((item) => item.id === productData.id);
    if (existingIndex >= 0) state.products[existingIndex] = productData;
    else state.products.unshift(productData);

    persistState();
    renderCatalog();
    renderAdminList();
    resetForm();
  });
}

if (cancelBtn) cancelBtn.addEventListener('click', () => resetForm());

function renderAdminView() {
  if (!authSection || !adminContent) {
    renderAdminList();
    return;
  }

  if (state.authenticated) {
    authSection.hidden = true;
    adminContent.hidden = false;
    renderAdminList();
    return;
  }

  authSection.hidden = false;
  adminContent.hidden = true;
}

function renderCatalog() {
  renderCategoryCatalog('tortas', cakesCatalog, cakesControls);
  renderCategoryCatalog('velas-toppers', accessoriesCatalog, accessoriesControls);
}

function renderCategoryCatalog(category, container, controlsContainer) {
  if (!container || !cardTemplate) return;

  container.innerHTML = '';
  const products = state.products.filter((item) => item.category === category);
  const view = state.catalogView[category];

  if (!products.length) {
    container.innerHTML = '<p class="empty">No hay productos en esta categoría.</p>';
    if (controlsContainer) controlsContainer.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(products.length / CATALOG_PAGE_SIZE);
  if (view.page >= totalPages) view.page = Math.max(0, totalPages - 1);

  const visibleProducts = view.showAll
    ? products
    : products.slice(view.page * CATALOG_PAGE_SIZE, (view.page + 1) * CATALOG_PAGE_SIZE);

  visibleProducts.forEach((item) => {
    const card = cardTemplate.content.cloneNode(true);
    card.querySelector('.badge').textContent = CATEGORY_LABELS[item.category];
    card.querySelector('img').src = item.image;
    card.querySelector('img').alt = item.name;
    card.querySelector('h3').textContent = item.name;
    card.querySelector('.description').textContent = item.description;
    card.querySelector('.price').textContent = formatCurrency(item.price);
    container.appendChild(card);
  });

  renderCategoryControls(category, products.length, totalPages, controlsContainer);
}

function renderCategoryControls(category, totalItems, totalPages, controlsContainer) {
  if (!controlsContainer) return;

  const view = state.catalogView[category];
  const hasMany = totalItems > CATALOG_PAGE_SIZE;

  if (!hasMany) {
    controlsContainer.innerHTML = '';
    return;
  }

  const showAllLabel = view.showAll ? 'Ver por páginas' : 'Mostrar todo';
  const pageLabel = view.showAll ? `Mostrando ${totalItems} productos` : `Página ${view.page + 1} de ${totalPages}`;

  controlsContainer.innerHTML = `
    <button type="button" class="catalog-nav" data-action="prev" ${view.showAll || view.page === 0 ? 'disabled' : ''}>←</button>
    <span class="catalog-page">${pageLabel}</span>
    <button type="button" class="catalog-nav" data-action="next" ${view.showAll || view.page >= totalPages - 1 ? 'disabled' : ''}>→</button>
    <button type="button" class="catalog-show-all" data-action="toggle">${showAllLabel}</button>
  `;

  controlsContainer.querySelector('[data-action="prev"]').addEventListener('click', () => {
    if (view.page > 0) {
      view.page -= 1;
      renderCatalog();
    }
  });

  controlsContainer.querySelector('[data-action="next"]').addEventListener('click', () => {
    if (view.page < totalPages - 1) {
      view.page += 1;
      renderCatalog();
    }
  });

  controlsContainer.querySelector('[data-action="toggle"]').addEventListener('click', () => {
    view.showAll = !view.showAll;
    renderCatalog();
  });
}

function renderAdminList() {
  if (!adminList || !state.authenticated) return;

  adminList.innerHTML = '';
  if (!state.products.length) {
    adminList.innerHTML = '<li class="empty">No hay productos para administrar.</li>';
    return;
  }

  state.products.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'admin-item';
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <small>${CATEGORY_LABELS[item.category]} · ${formatCurrency(item.price)}</small>
      </div>
      <div class="admin-actions">
        <button type="button" class="edit">Editar</button>
        <button type="button" class="delete">Eliminar</button>
      </div>
    `;

    li.querySelector('.edit').addEventListener('click', () => startEditing(item.id));
    li.querySelector('.delete').addEventListener('click', () => deleteProduct(item.id));
    adminList.appendChild(li);
  });
}

function startEditing(id) {
  if (!form || !state.authenticated) return;
  const item = state.products.find((product) => product.id === id);
  if (!item) return;

  idField.value = item.id;
  categoryField.value = item.category;
  nameField.value = item.name;
  priceField.value = item.price;
  descriptionField.value = item.description;
  imageField.value = '';
  cancelBtn.hidden = false;
  saveBtn.textContent = 'Actualizar producto';
}

function deleteProduct(id) {
  if (!state.authenticated) return;
  state.products = state.products.filter((item) => item.id !== id);
  persistState();
  renderCatalog();
  renderAdminList();
  if (idField && idField.value === id) resetForm();
}

function resetForm() {
  if (!form) return;
  form.reset();
  idField.value = '';
  categoryField.value = 'tortas';
  cancelBtn.hidden = true;
  saveBtn.textContent = 'Guardar producto';
}

async function resolveImageSource() {
  const selectedFile = imageField.files?.[0];
  if (selectedFile) return fileToDataURL(selectedFile);
  if (idField.value) {
    const existingProduct = state.products.find((item) => item.id === idField.value);
    return existingProduct?.image || '';
  }
  return '';
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });
}

function loadProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return [...defaultProducts];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [...defaultProducts];

    return parsed.map((item) => ({
      ...item,
      category: CATEGORY_LABELS[item.category] ? item.category : 'tortas'
    }));
  } catch {
    return [...defaultProducts];
  }
}

function readAuthState() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

function persistAuthState(value) {
  localStorage.setItem(AUTH_STORAGE_KEY, String(value));
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.products));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
}
