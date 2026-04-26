# inventory-frontend

Interfaz web del Sistema de Inventario construida con **React 18 + Vite + TypeScript**.

## Stack

- React 18 + TypeScript
- Vite 5
- TanStack Query v5 (data fetching)
- React Hook Form (formularios)
- React Router v6 (navegación)
- React Hot Toast (notificaciones)
- Lucide React (íconos)
- CSS Variables (design system propio)

## Módulos

- **Dashboard** — Estadísticas y alertas de stock bajo
- **Productos** — CRUD completo con búsqueda y paginación
- **Categorías** — CRUD completo
- **Proveedores** — CRUD completo

## Levantar localmente

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev
# → http://localhost:3000

# Build producción
npm run build

# Preview del build
npm run preview
```

## Variable de entorno

```bash
# .env.local
VITE_API_URL=http://localhost:8080/api
```

## Levantar con Docker

```bash
docker compose up -d
# → http://localhost:3000
```

> Requiere que la red `inventory-net` exista (levantada desde `inventory-database` o `inventory-backend`).

## Estructura

```
src/
├── pages/
│   ├── DashboardPage.tsx
│   ├── ProductosPage.tsx
│   ├── CategoriasPage.tsx
│   └── ProveedoresPage.tsx
├── services/
│   └── api.ts          # Axios + endpoints
├── types/
│   └── index.ts        # Interfaces TypeScript
├── App.tsx             # Router + layout
└── index.css           # Design system (CSS variables)
```

## CI/CD (GitHub Actions)

El workflow `.github/workflows/ci-cd.yml` ejecuta en cada push:

1. **Lint** — ESLint
2. **Test** — Vitest
3. **Build check** — `vite build`
4. **Docker build & push** → `ghcr.io/<org>/inventory-frontend:latest` (solo en `main`)

## Secret requerido en GitHub

| Secret         | Descripción                        |
|----------------|------------------------------------|
| `VITE_API_URL` | URL del backend en producción      |
