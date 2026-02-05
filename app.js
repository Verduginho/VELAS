const STORAGE_KEY = 'velas-products';

const CATEGORY_LABELS = {
  tortas: 'Tortas',
  'velas-toppers': 'Velas y toppers'
};

const defaultProducts = [
  {
    id: crypto.randomUUID(),
    category: 'tortas',
    name: 'Torta Red Velvet',
    price: 32,
    description: 'Bizcocho rojo aterciopelado con frosting de queso crema.',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'tortas',
    name: 'Torta de Chocolate',
    price: 28,
    description: 'Capas de chocolate intenso con relleno de ganache.',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'velas-toppers',
    name: 'Topper Feliz Cumple',
    price: 6,
    description: 'Topper acrílico dorado para tortas de cumpleaños.',
    image:
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    category: 'velas-toppers',
    name: 'Set de Velas Metalizadas',
    price: 5,
    description: 'Pack de velas premium en tonos dorados y rosados.',
    image:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80'
  }
];

const state = {
  products: loadProducts()
};

const cakesCatalog = document.getElementById('catalog-cakes');
const accessoriesCatalog = document.getElementById('catalog-accessories');
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

renderCatalog();
renderAdminList();

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const imageSource = await resolveImageSource();
    const productData = {
      id: idField.value || crypto.randomUUID(),
      category: categoryField.value,
      name: nameField.value.trim(),
      price: Number(priceField.value),
      description: descriptionField.value.trim() || 'Sin descripción.',
      image: imageSource
    };

    if (
      !productData.name ||
      !productData.image ||
      !CATEGORY_LABELS[productData.category] ||
      Number.isNaN(productData.price) ||
      productData.price <= 0
    ) {
      return;
    }

    const existingIndex = state.products.findIndex((item) => item.id === productData.id);

    if (existingIndex >= 0) {
      state.products[existingIndex] = productData;
    } else {
      state.products.unshift(productData);
    }

    persistState();
    renderCatalog();
    renderAdminList();
    resetForm();
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    resetForm();
  });
}

function renderCatalog() {
  renderCategoryCatalog('tortas', cakesCatalog);
  renderCategoryCatalog('velas-toppers', accessoriesCatalog);
}

function renderCategoryCatalog(category, container) {
  if (!container || !cardTemplate) return;

  container.innerHTML = '';
  const products = state.products.filter((item) => item.category === category);

  if (!products.length) {
    container.innerHTML = '<p class="empty">No hay productos en esta categoría.</p>';
    return;
  }

  products.forEach((item) => {
    const card = cardTemplate.content.cloneNode(true);
    const badge = card.querySelector('.badge');
    const image = card.querySelector('img');
    const title = card.querySelector('h3');
    const description = card.querySelector('.description');
    const price = card.querySelector('.price');

    badge.textContent = CATEGORY_LABELS[item.category];
    image.src = item.image;
    image.alt = item.name;
    title.textContent = item.name;
    description.textContent = item.description;
    price.textContent = formatCurrency(item.price);

    container.appendChild(card);
  });
}

function renderAdminList() {
  if (!adminList) return;

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
  if (!form) return;

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
  state.products = state.products.filter((item) => item.id !== id);
  persistState();
  renderCatalog();
  renderAdminList();

  if (idField && idField.value === id) {
    resetForm();
  }
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
  if (selectedFile) {
    return fileToDataURL(selectedFile);
  }

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

    if (!Array.isArray(parsed)) {
      return [...defaultProducts];
    }

    return parsed.map((item) => ({
      ...item,
      category: CATEGORY_LABELS[item.category] ? item.category : 'tortas'
    }));
  } catch {
    return [...defaultProducts];
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.products));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}
