const STORAGE_KEY = 'velas-products';
const AUTH_STORAGE_KEY = 'velas-admin-auth';
const ADMIN_USERNAME = 'judith';
const ADMIN_PASSWORD = 'admin';
const CATALOG_PAGE_SIZE = 4;

const CATEGORY_LABELS = {
  tortas: 'Tortas',
  'velas-toppers': 'Velas y toppers'
};

const DEFAULT_PRODUCTS = [
  {
    id: crypto.randomUUID(),
    category: 'tortas',
    name: 'Torta Red Velvet',
    price: 32,
    description: 'Bizcocho rojo aterciopelado con frosting de queso crema.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'tortas',
    name: 'Torta de Chocolate',
    price: 28,
    description: 'Capas de chocolate intenso con relleno de ganache.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'tortas',
    name: 'Cheesecake de Maracuyá',
    price: 30,
    description: 'Cremoso cheesecake con cobertura de maracuyá.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'tortas',
    name: 'Torta Selva Negra',
    price: 34,
    description: 'Chocolate, crema chantilly y cerezas.',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'tortas',
    name: 'Torta Tres Leches',
    price: 29,
    description: 'Bizcocho suave bañado en mezcla de tres leches.',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'tortas',
    name: 'Torta de Vainilla y Fresas',
    price: 31,
    description: 'Capas de vainilla, crema y fresas frescas.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'velas-toppers',
    name: 'Topper Feliz Cumple',
    price: 6,
    description: 'Topper acrílico dorado para tortas de cumpleaños.',
    image: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'velas-toppers',
    name: 'Set de Velas Metalizadas',
    price: 5,
    description: 'Pack de velas premium en tonos dorados y rosados.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'velas-toppers',
    name: 'Vela Numérica 1-9',
    price: 4,
    description: 'Velas numéricas individuales con brillo.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'velas-toppers',
    name: 'Topper Personalizado',
    price: 12,
    description: 'Topper con nombre en acrílico espejo.',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'velas-toppers',
    name: 'Set Velas Arcoíris',
    price: 7,
    description: 'Set colorido ideal para fiestas infantiles.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'velas-toppers',
    name: 'Mini Topper Corazón',
    price: 5,
    description: 'Topper decorativo pequeño para cupcakes y tortas.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  }
];

const state = {
  products: loadProducts(),
  authenticated: readAuthState(),
  catalogView: {
    tortas: { page: 0, showAll: false },
    'velas-toppers': { page: 0, showAll: false }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    cakesCatalog: document.getElementById('catalog-cakes'),
    accessoriesCatalog: document.getElementById('catalog-accessories'),
    cakesControls: document.getElementById('controls-tortas'),
    accessoriesControls: document.getElementById('controls-velas-toppers'),
    cardTemplate: document.getElementById('cake-card-template'),
    authSection: document.getElementById('auth-section'),
    adminContent: document.getElementById('admin-content'),
    loginForm: document.getElementById('login-form'),
    loginUserField: document.getElementById('login-username'),
    loginPasswordField: document.getElementById('login-password'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn'),
    form: document.getElementById('cake-form'),
    idField: document.getElementById('cake-id'),
    categoryField: document.getElementById('cake-category'),
    nameField: document.getElementById('cake-name'),
    priceField: document.getElementById('cake-price'),
    descriptionField: document.getElementById('cake-description'),
    imageField: document.getElementById('cake-image'),
    formError: document.getElementById('form-error'),
    cancelBtn: document.getElementById('cancel-btn'),
    saveBtn: document.getElementById('save-btn'),
    adminList: document.getElementById('admin-list')
  };

  bindAuthEvents(elements);
  bindAdminEvents(elements);
  renderAdminView(elements);
  renderCatalog(elements);
});

function bindAuthEvents(elements) {
  const { loginForm, loginUserField, loginPasswordField, loginError, logoutBtn } = elements;

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
        renderAdminView(elements);
        return;
      }

      state.authenticated = false;
      persistAuthState(false);
      loginError.hidden = false;
    });
  }

  if (loginUserField) {
    loginUserField.addEventListener('input', () => {
      loginError.hidden = true;
    });
  }

  if (loginPasswordField) {
    loginPasswordField.addEventListener('input', () => {
      loginError.hidden = true;
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.authenticated = false;
      persistAuthState(false);
      renderAdminView(elements);
    });
  }
}

function bindAdminEvents(elements) {
  const { form, cancelBtn } = elements;

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!state.authenticated) return;

      try {
        const product = await buildProductFromForm(elements);
        if (!product) return;

        upsertProduct(product);
        persistProducts();
        resetForm(elements);
        renderCatalog(elements);
        renderAdminList(elements);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo guardar el producto.';
        if (elements.formError) {
          elements.formError.hidden = false;
          elements.formError.textContent = message;
        }
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      resetForm(elements);
    });
  }
}

async function buildProductFromForm(elements) {
  const {
    idField,
    categoryField,
    nameField,
    priceField,
    descriptionField,
    imageField,
    formError
  } = elements;

  const imageSource = await resolveImageSource(imageField, idField.value);
  const product = {
    id: idField.value || crypto.randomUUID(),
    category: categoryField.value,
    name: nameField.value.trim(),
    price: Number(priceField.value),
    description: descriptionField.value.trim() || 'Sin descripción.',
    image: imageSource
  };

  if (!isValidProduct(product)) {
    if (formError) {
      formError.hidden = false;
      formError.textContent = 'Completa todos los campos correctamente e incluye una imagen.';
    }

    return null;
  }

  if (formError) formError.hidden = true;
  return product;
}

function isValidProduct(product) {
  return (
    Boolean(product.name) &&
    Boolean(product.image) &&
    Boolean(CATEGORY_LABELS[product.category]) &&
    !Number.isNaN(product.price) &&
    product.price > 0
  );
}

function upsertProduct(product) {
  const index = state.products.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    state.products[index] = product;
    return;
  }

  state.products.unshift(product);
}

function renderAdminView(elements) {
  const { authSection, adminContent, adminList } = elements;
  if (!authSection || !adminContent) {
    renderAdminList(elements);
    return;
  }

  authSection.hidden = state.authenticated;
  adminContent.hidden = !state.authenticated;

  if (state.authenticated) {
    renderAdminList(elements);
    return;
  }

  if (adminList) {
    adminList.innerHTML = '';
  }

  resetForm(elements);
}

function renderCatalog(elements) {
  renderCategoryCatalog('tortas', elements.cakesCatalog, elements.cakesControls, elements.cardTemplate, elements);
  renderCategoryCatalog(
    'velas-toppers',
    elements.accessoriesCatalog,
    elements.accessoriesControls,
    elements.cardTemplate,
    elements
  );
}

function renderCategoryCatalog(category, container, controlsContainer, cardTemplate, elements) {
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
  if (view.page >= totalPages) {
    view.page = Math.max(0, totalPages - 1);
  }

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

  renderCategoryControls(category, products.length, totalPages, controlsContainer, elements);
}

function renderCategoryControls(category, totalItems, totalPages, controlsContainer, elements) {
  if (!controlsContainer) return;

  const view = state.catalogView[category];
  const hasMany = totalItems > CATALOG_PAGE_SIZE;

  if (!hasMany) {
    controlsContainer.innerHTML = '';
    return;
  }

  const showAllLabel = view.showAll ? 'Ver por páginas' : 'Mostrar todo';
  const pageLabel = view.showAll
    ? `Mostrando ${totalItems} productos`
    : `Página ${view.page + 1} de ${totalPages}`;

  controlsContainer.innerHTML = `
    <button type="button" class="catalog-nav" data-action="prev" aria-label="Página anterior" ${
      view.showAll || view.page === 0 ? 'disabled' : ''
    }>←</button>
    <span class="catalog-page">${pageLabel}</span>
    <button type="button" class="catalog-nav" data-action="next" aria-label="Página siguiente" ${
      view.showAll || view.page >= totalPages - 1 ? 'disabled' : ''
    }>→</button>
    <button type="button" class="catalog-show-all" data-action="toggle">${showAllLabel}</button>
  `;

  controlsContainer.querySelector('[data-action="prev"]').addEventListener('click', () => {
    if (view.page > 0) {
      view.page -= 1;
      renderCatalog(elements);
    }
  });

  controlsContainer.querySelector('[data-action="next"]').addEventListener('click', () => {
    if (view.page < totalPages - 1) {
      view.page += 1;
      renderCatalog(elements);
    }
  });

  controlsContainer.querySelector('[data-action="toggle"]').addEventListener('click', () => {
    view.showAll = !view.showAll;
    renderCatalog(elements);
  });
}

function renderAdminList(elements) {
  const { adminList } = elements;
  if (!adminList || !state.authenticated) return;

  adminList.innerHTML = '';

  if (!state.products.length) {
    adminList.innerHTML = '<li class="empty">No hay productos para administrar.</li>';
    return;
  }

  state.products.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'admin-item';

    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = item.name;

    const meta = document.createElement('small');
    meta.textContent = `${CATEGORY_LABELS[item.category]} · ${formatCurrency(item.price)}`;

    content.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'admin-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => startEditing(item.id, elements));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.addEventListener('click', () => deleteProduct(item.id, elements));

    actions.append(editBtn, deleteBtn);
    li.append(content, actions);
    adminList.appendChild(li);
  });
}

function startEditing(id, elements) {
  const {
    form,
    idField,
    categoryField,
    nameField,
    priceField,
    descriptionField,
    imageField,
    cancelBtn,
    saveBtn,
    formError
  } = elements;

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
  if (formError) formError.hidden = true;
}

function deleteProduct(id, elements) {
  if (!state.authenticated) return;

  state.products = state.products.filter((item) => item.id !== id);
  persistProducts();
  renderCatalog(elements);
  renderAdminList(elements);

  if (elements.idField && elements.idField.value === id) {
    resetForm(elements);
  }
}

function resetForm(elements) {
  const { form, idField, categoryField, cancelBtn, saveBtn, formError } = elements;

  if (!form) return;

  form.reset();
  idField.value = '';
  categoryField.value = 'tortas';
  cancelBtn.hidden = true;
  saveBtn.textContent = 'Guardar producto';
  if (formError) formError.hidden = true;
}

async function resolveImageSource(imageField, editingId) {
  const selectedFile = imageField?.files?.[0];
  if (selectedFile) return fileToDataURL(selectedFile);

  if (editingId) {
    const existing = state.products.find((item) => item.id === editingId);
    return existing?.image || '';
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
  if (typeof localStorage === 'undefined') return [...DEFAULT_PRODUCTS];

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return [...DEFAULT_PRODUCTS];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [...DEFAULT_PRODUCTS];

    return parsed.map((item) => ({
      id: item.id || crypto.randomUUID(),
      category: CATEGORY_LABELS[item.category] ? item.category : 'tortas',
      name: String(item.name || '').trim() || 'Producto sin nombre',
      price: Number(item.price) > 0 ? Number(item.price) : 1,
      description: String(item.description || '').trim() || 'Sin descripción.',
      image: String(item.image || '')
    }));
  } catch {
    return [...DEFAULT_PRODUCTS];
  }
}

function readAuthState() {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

function persistAuthState(value) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, String(value));
}

function persistProducts() {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.products));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
}
