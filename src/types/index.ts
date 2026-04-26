// ─── Pagination ───────────────────────────────────────────────
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ─── Categoria ────────────────────────────────────────────────
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

// ─── Proveedor ────────────────────────────────────────────────
export interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  nit?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProveedorRequest {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  nit?: string;
  activo?: boolean;
}

// ─── Producto ─────────────────────────────────────────────────
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  sku: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  stockBajo: boolean;
  categoria: Pick<Categoria, 'id' | 'nombre'>;
  proveedor: Pick<Proveedor, 'id' | 'nombre' | 'email'>;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductoRequest {
  nombre: string;
  descripcion?: string;
  sku: string;
  precio: number;
  stock: number;
  stockMinimo?: number;
  categoriaId: number;
  proveedorId: number;
  activo?: boolean;
}
