import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { proveedorService } from '../services/api'
import type { ProveedorRequest } from '../types'

export default function ProveedoresPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState<{ open: boolean; id?: number }>({ open: false })

  const { data, isLoading } = useQuery({
    queryKey: ['proveedores', page],
    queryFn: () => proveedorService.getAll(page),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProveedorRequest>()

  const openCreate = () => { reset({}); setModal({ open: true }) }
  const openEdit = (row: any) => { reset(row); setModal({ open: true, id: row.id }) }
  const closeModal = () => setModal({ open: false })
  const invalidate = () => qc.invalidateQueries({ queryKey: ['proveedores'] })

  const createMut = useMutation({
    mutationFn: (d: ProveedorRequest) => proveedorService.create(d),
    onSuccess: () => { toast.success('Proveedor creado'); closeModal(); invalidate() },
    onError: (e: Error) => toast.error(e.message),
  })
  const updateMut = useMutation({
    mutationFn: (d: ProveedorRequest) => proveedorService.update(modal.id!, d),
    onSuccess: () => { toast.success('Proveedor actualizado'); closeModal(); invalidate() },
    onError: (e: Error) => toast.error(e.message),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => proveedorService.delete(id),
    onSuccess: () => { toast.success('Proveedor eliminado'); invalidate() },
    onError: (e: Error) => toast.error(e.message),
  })

  const onSubmit = (d: ProveedorRequest) =>
    modal.id ? updateMut.mutate(d) : createMut.mutate(d)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Proveedores</h1>
          <p className="page-subtitle">{data?.totalElements ?? 0} registros</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Nuevo Proveedor
        </button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="empty-state">Cargando...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Nombre</th><th>Email</th><th>NIT</th><th>Teléfono</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.email}</td>
                    <td><span className="sku">{p.nit || '—'}</span></td>
                    <td>{p.telefono || '—'}</td>
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
                          onClick={() => { if (confirm('¿Eliminar proveedor?')) deleteMut.mutate(p.id) }}>
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
              <h2 className="modal-title">{modal.id ? 'Editar' : 'Nuevo'} Proveedor</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Nombre *</label>
                  <input {...register('nombre', { required: 'Requerido' })} placeholder="TechSupplies SAS" />
                  {errors.nombre && <span className="form-error">{errors.nombre.message}</span>}
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" {...register('email', { required: 'Requerido' })} placeholder="ventas@empresa.co" />
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>
                <div className="form-group">
                  <label>NIT</label>
                  <input {...register('nit')} placeholder="900100200-1" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input {...register('telefono')} placeholder="+57 318 000 0001" />
                </div>
                <div className="form-group full">
                  <label>Dirección</label>
                  <input {...register('direccion')} placeholder="Cra 15 # 93-75, Bogotá" />
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
