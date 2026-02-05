const STORAGE_KEY = 'velas-cakes';

const defaultCakes = [
  {
    id: crypto.randomUUID(),
    name: 'Torta Red Velvet',
    price: 32,
    description: 'Bizcocho rojo aterciopelado con frosting de queso crema.',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    name: 'Torta de Chocolate',
    price: 28,
    description: 'Capas de chocolate intenso con relleno de ganache.',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: crypto.randomUUID(),
    name: 'Cheesecake de Frutos Rojos',
    price: 26,
    description: 'Base crocante y cobertura de frutos rojos frescos.',
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80'
  }
];

const state = {
  cakes: loadCakes()
};

const catalog = document.getElementById('catalog');
const adminList = document.getElementById('admin-list');
const form = document.getElementById('cake-form');
const idField = document.getElementById('cake-id');
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
    const cakeData = {
      id: idField.value || crypto.randomUUID(),
      name: nameField.value.trim(),
      price: Number(priceField.value),
      description: descriptionField.value.trim() || 'Sin descripción.',
      image: imageSource
    };

    if (!cakeData.name || !cakeData.image || Number.isNaN(cakeData.price) || cakeData.price <= 0) {
      return;
    }

    const existingIndex = state.cakes.findIndex((cake) => cake.id === cakeData.id);

    if (existingIndex >= 0) {
      state.cakes[existingIndex] = cakeData;
    } else {
      state.cakes.unshift(cakeData);
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
  if (!catalog || !cardTemplate) return;

  catalog.innerHTML = '';

  if (!state.cakes.length) {
    catalog.innerHTML = '<p class="empty">No hay tortas registradas todavía.</p>';
    return;
  }

  state.cakes.forEach((cake) => {
    const card = cardTemplate.content.cloneNode(true);
    const image = card.querySelector('img');
    const title = card.querySelector('h3');
    const description = card.querySelector('.description');
    const price = card.querySelector('.price');

    image.src = cake.image;
    image.alt = cake.name;
    title.textContent = cake.name;
    description.textContent = cake.description;
    price.textContent = formatCurrency(cake.price);

    catalog.appendChild(card);
  });
}

function renderAdminList() {
  if (!adminList) return;

  adminList.innerHTML = '';

  if (!state.cakes.length) {
    adminList.innerHTML = '<li class="empty">No hay tortas para administrar.</li>';
    return;
  }

  state.cakes.forEach((cake) => {
    const li = document.createElement('li');
    li.className = 'admin-item';

    li.innerHTML = `
      <div>
        <strong>${cake.name}</strong>
        <small>${formatCurrency(cake.price)}</small>
      </div>
      <div class="admin-actions">
        <button type="button" class="edit">Editar</button>
        <button type="button" class="delete">Eliminar</button>
      </div>
    `;

    li.querySelector('.edit').addEventListener('click', () => startEditing(cake.id));
    li.querySelector('.delete').addEventListener('click', () => deleteCake(cake.id));

    adminList.appendChild(li);
  });
}

function startEditing(id) {
  if (!form) return;

  const cake = state.cakes.find((item) => item.id === id);
  if (!cake) return;

  idField.value = cake.id;
  nameField.value = cake.name;
  priceField.value = cake.price;
  descriptionField.value = cake.description;
  imageField.value = '';
  cancelBtn.hidden = false;
  saveBtn.textContent = 'Actualizar torta';
}

function deleteCake(id) {
  state.cakes = state.cakes.filter((cake) => cake.id !== id);
  persistState();
  renderAdminList();

  if (idField && idField.value === id) {
    resetForm();
  }
}

function resetForm() {
  if (!form) return;

  form.reset();
  idField.value = '';
  cancelBtn.hidden = true;
  saveBtn.textContent = 'Guardar torta';
}

async function resolveImageSource() {
  const selectedFile = imageField.files?.[0];
  if (selectedFile) {
    return fileToDataURL(selectedFile);
  }

  if (idField.value) {
    const existingCake = state.cakes.find((cake) => cake.id === idField.value);
    return existingCake?.image || '';
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

function loadCakes() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCakes));
    return [...defaultCakes];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [...defaultCakes];
  } catch {
    return [...defaultCakes];
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cakes));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}
