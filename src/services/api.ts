import axios from 'axios'
import type { PageResponse, Categoria, CategoriaRequest, Proveedor, ProveedorRequest, Producto, ProductoRequest } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.response?.data?.error || 'Error del servidor'
    return Promise.reject(new Error(message))
  }
)

// ─── Categorias ───────────────────────────────────────────────
export const categoriaService = {
  getAll: (page = 0, size = 10) =>
    api.get<PageResponse<Categoria>>(`/v1/categorias?page=${page}&size=${size}`).then(r => r.data),
  getById: (id: number) =>
    api.get<Categoria>(`/v1/categorias/${id}`).then(r => r.data),
  create: (data: CategoriaRequest) =>
    api.post<Categoria>('/v1/categorias', data).then(r => r.data),
  update: (id: number, data: CategoriaRequest) =>
    api.put<Categoria>(`/v1/categorias/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/v1/categorias/${id}`),
}

// ─── Proveedores ──────────────────────────────────────────────
export const proveedorService = {
  getAll: (page = 0, size = 10) =>
    api.get<PageResponse<Proveedor>>(`/v1/proveedores?page=${page}&size=${size}`).then(r => r.data),
  getById: (id: number) =>
    api.get<Proveedor>(`/v1/proveedores/${id}`).then(r => r.data),
  create: (data: ProveedorRequest) =>
    api.post<Proveedor>('/v1/proveedores', data).then(r => r.data),
  update: (id: number, data: ProveedorRequest) =>
    api.put<Proveedor>(`/v1/proveedores/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/v1/proveedores/${id}`),
}

// ─── Productos ────────────────────────────────────────────────
export const productoService = {
  getAll: (page = 0, size = 10, nombre?: string) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) })
    if (nombre) params.append('nombre', nombre)
    return api.get<PageResponse<Producto>>(`/v1/productos?${params}`).then(r => r.data)
  },
  getById: (id: number) =>
    api.get<Producto>(`/v1/productos/${id}`).then(r => r.data),
  getStockBajo: (page = 0) =>
    api.get<PageResponse<Producto>>(`/v1/productos/stock-bajo?page=${page}`).then(r => r.data),
  create: (data: ProductoRequest) =>
    api.post<Producto>('/v1/productos', data).then(r => r.data),
  update: (id: number, data: ProductoRequest) =>
    api.put<Producto>(`/v1/productos/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/v1/productos/${id}`),
}
