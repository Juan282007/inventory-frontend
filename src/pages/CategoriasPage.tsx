import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { categoriaService } from '../services/api'
import type { CategoriaRequest } from '../types'

export default function CategoriasPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState<{ open: boolean; id?: number }>({ open: false })

  const { data, isLoading } = useQuery({
    queryKey: ['categorias', page],
    queryFn: () => categoriaService.getAll(page),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoriaRequest>()

  const openCreate = () => { reset({}); setModal({ open: true }) }
  const openEdit = (row: any) => { reset(row); setModal({ open: true, id: row.id }) }
  const closeModal = () => setModal({ open: false })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['categorias'] })

  const createMut = useMutation({
    mutationFn: (d: CategoriaRequest) => categoriaService.create(d),
    onSuccess: () => { toast.success('Categoría creada'); closeModal(); invalidate() },
    onError: (e: Error) => toast.error(e.message),
  })
  const updateMut = useMutation({
    mutationFn: (d: CategoriaRequest) => categoriaService.update(modal.id!, d),
    onSuccess: () => { toast.success('Categoría actualizada'); closeModal(); invalidate() },
    onError: (e: Error) => toast.error(e.message),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => categoriaService.delete(id),
    onSuccess: () => { toast.success('Categoría eliminada'); invalidate() },
    onError: (e: Error) => toast.error(e.message),
  })

  const onSubmit = (d: CategoriaRequest) =>
    modal.id ? updateMut.mutate(d) : createMut.mutate(d)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categorías</h1>
          <p className="page-subtitle">{data?.totalElements ?? 0} registros</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Nueva Categoría
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
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>{c.descripcion || '—'}</td>
                    <td>
                      <span className={`badge ${c.activo ? 'badge-success' : 'badge-danger'}`}>
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(c)}>
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-icon btn-sm"
                          onClick={() => { if (confirm('¿Eliminar categoría?')) deleteMut.mutate(c.id) }}
                        >
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
              <h2 className="modal-title">{modal.id ? 'Editar' : 'Nueva'} Categoría</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Nombre *</label>
                  <input {...register('nombre', { required: 'Requerido' })} placeholder="Electrónica" />
                  {errors.nombre && <span className="form-error">{errors.nombre.message}</span>}
                </div>
                <div className="form-group full">
                  <label>Descripción</label>
                  <textarea {...register('descripcion')} rows={3} placeholder="Descripción de la categoría..." />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {modal.id ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
