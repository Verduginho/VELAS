# VELAS - Catálogo de Tortas

Aplicación web simple para:

- Ver un catálogo de tortas con nombre, descripción, imagen y precio.
- Administrar el catálogo desde una página separada: crear, editar y eliminar tortas.
- Cargar imágenes desde archivos locales (sin URL manual).
- Persistir cambios en `localStorage`.

## Páginas

- `index.html`: catálogo público de tortas.
- `admin.html`: panel de administración (CRUD).

Ambas páginas están conectadas por navegación superior.

## Uso

1. Abrí `index.html` para ver el catálogo.
2. Entrá a `admin.html` para administrar tortas.
3. Los cambios se guardan localmente y se reflejan automáticamente en el catálogo.

## Estructura

- `index.html`: vista de catálogo.
- `admin.html`: vista de administración.
- `styles.css`: estilos compartidos y responsive.
- `app.js`: lógica de catálogo + administración con almacenamiento local.
