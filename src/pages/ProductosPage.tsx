import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import { productoService, categoriaService, proveedorService } from '../services/api'
import type { ProductoRequest } from '../types'

export default function ProductosPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; id?: number }>({ open: false })

  const { data, isLoading } = useQuery({
    queryKey: ['productos', page, search],
    queryFn: () => productoService.getAll(page, 10, search || undefined),
  })
  const { data: categorias } = useQuery({
    queryKey: ['categorias-select'],
    queryFn: () => categoriaService.getAll(0, 100),
  })
  const { data: proveedores } = useQuery({
    queryKey: ['proveedores-select'],
    queryFn: () => proveedorService.getAll(0, 100),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductoRequest>()

  const openCreate = () => { reset({}); setModal({ open: true }) }
  const openEdit = (row: any) => {
    reset({ ...row, categoriaId: row.categoria?.id, proveedorId: row.proveedor?.id })
    setModal({ open: true, id: row.id })
  }
  const closeModal = () => setModal({ open: false })
  const invalidate = () => qc.invalidateQueries({ queryKey: ['productos'] })

  const createMut = useMutation({
    mutationFn: (d: ProductoRequest) => productoService.create(d),
    onSuccess: () => { toast.success('Producto creado'); closeModal(); invalidate() },
    onError: (e: Error) => toast.error(e.message),
  })
  const updateMut = useMutation({
    mutationFn: (d: ProductoRequest) => productoService.update(modal.id!, d),
    onSuccess: () => { toast.success('Producto actualizado'); closeModal(); invalidate() },
    onError: (e: Error) => toast.error(e.message),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => productoService.delete(id),
    onSuccess: () => { toast.success('Producto eliminado'); invalidate() },
    onError: (e: Error) => toast.error(e.message),
  })

  const onSubmit = (d: ProductoRequest) =>
    modal.id ? updateMut.mutate(d) : createMut.mutate(d)

  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">{data?.totalElements ?? 0} registros</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      <div className="search-bar">
        <Search size={16} style={{ color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }}
          placeholder="Buscar por nombre..."
        />
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Cargando...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th><th>SKU</th><th>Precio</th><th>Stock</th>
                  <th>Categoría</th><th>Proveedor</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map(p => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td><span className="sku">{p.sku}</span></td>
                    <td>{fmt(p.precio)}</td>
                    <td>
                      <span className={`badge ${p.stockBajo ? 'badge-warning' : 'badge-accent'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>{p.categoria.nombre}</td>
                    <td>{p.proveedor.nombre}</td>
                    <td>
                      <span className={`badge ${p.activo ? 'badge-success' : 'badge-danger'}`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}>
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-danger btn-icon btn-sm"
                          onClick={() => { if (confirm('¿Eliminar producto?')) deleteMut.mutate(p.id) }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="pagination">
          <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Anterior</button>
          <span>Página {page + 1} de {data?.totalPages ?? 1}</span>
          <button className="btn btn-ghost btn-sm" disabled={data?.last} onClick={() => setPage(p => p + 1)}>Siguiente →</button>
        </div>
      </div>

      {modal.open && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modal.id ? 'Editar' : 'Nuevo'} Producto</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Nombre *</label>
                  <input {...register('nombre', { required: 'Requerido' })} placeholder="Laptop HP 15" />
                  {errors.nombre && <span className="form-error">{errors.nombre.message}</span>}
                </div>
                <div className="form-group">
                  <label>SKU *</label>
                  <input {...register('sku', { required: 'Requerido' })} placeholder="TECH-LAP-001" />
                  {errors.sku && <span className="form-error">{errors.sku.message}</span>}
                </div>
                <div className="form-group">
                  <label>Precio *</label>
                  <input type="number" step="0.01" {...register('precio', { required: 'Requerido', min: { value: 0.01, message: 'Debe ser mayor a 0' } })} placeholder="2500000" />
                  {errors.precio && <span className="form-error">{errors.precio.message}</span>}
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" {...register('stock', { min: 0 })} defaultValue={0} />
                </div>
                <div className="form-group">
                  <label>Stock Mínimo</label>
                  <input type="number" {...register('stockMinimo', { min: 0 })} defaultValue={0} />
                </div>
                <div className="form-group">
                  <label>Categoría *</label>
                  <select {...register('categoriaId', { required: 'Requerido', valueAsNumber: true })}>
                    <option value="">Seleccionar...</option>
                    {categorias?.content.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  {errors.categoriaId && <span className="form-error">{errors.categoriaId.message}</span>}
                </div>
                <div className="form-group">
                  <label>Proveedor *</label>
                  <select {...register('proveedorId', { required: 'Requerido', valueAsNumber: true })}>
                    <option value="">Seleccionar...</option>
                    {proveedores?.content.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                  {errors.proveedorId && <span className="form-error">{errors.proveedorId.message}</span>}
                </div>
                <div className="form-group full">
                  <label>Descripción</label>
                  <textarea {...register('descripcion')} rows={2} placeholder="Descripción del producto..." />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{modal.id ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
