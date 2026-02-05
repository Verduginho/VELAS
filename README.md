# VELAS - Catálogo de Productos

Aplicación web simple para:

- Ver un catálogo dividido en 2 categorías: **tortas** y **velas/toppers**.
- Administrar productos desde una página separada: crear, editar y eliminar.
- Cargar imágenes desde archivos locales (sin URL manual).
- Proteger el panel admin con login.
- Persistir cambios en `localStorage`.

## Páginas

- `index.html`: catálogo público por categorías.
- `admin.html`: panel de administración (CRUD) con login.

Ambas páginas están conectadas por navegación superior.

## Uso

1. Abrí `index.html` para ver el catálogo de categorías.
2. Entrá a `admin.html` e iniciá sesión.
3. En el formulario, elegí categoría (Tortas o Velas y toppers).
4. Los cambios se guardan localmente y se reflejan automáticamente en el catálogo.

## Estructura

- `index.html`: vista de catálogo con 2 secciones.
- `admin.html`: vista de administración con login y selector de categoría.
- `styles.css`: estilos compartidos y responsive.
- `app.js`: lógica de catálogo + autenticación admin + CRUD con almacenamiento local.
