import { useQuery } from '@tanstack/react-query'
import { Package, Tags, Truck, AlertTriangle } from 'lucide-react'
import { productoService, categoriaService, proveedorService } from '../services/api'

export default function DashboardPage() {
  const { data: productos } = useQuery({
    queryKey: ['productos-all'],
    queryFn: () => productoService.getAll(0, 100),
  })
  const { data: categorias } = useQuery({
    queryKey: ['categorias-all'],
    queryFn: () => categoriaService.getAll(0, 100),
  })
  const { data: proveedores } = useQuery({
    queryKey: ['proveedores-all'],
    queryFn: () => proveedorService.getAll(0, 100),
  })
  const { data: stockBajo } = useQuery({
    queryKey: ['stock-bajo'],
    queryFn: () => productoService.getStockBajo(),
  })

  const stats = [
    { label: 'Productos', value: productos?.totalElements ?? '—', icon: Package, color: 'var(--accent)' },
    { label: 'Categorías', value: categorias?.totalElements ?? '—', icon: Tags, color: 'var(--success)' },
    { label: 'Proveedores', value: proveedores?.totalElements ?? '—', icon: Truck, color: 'var(--warning)' },
    { label: 'Stock Bajo', value: stockBajo?.totalElements ?? '—', icon: AlertTriangle, color: 'var(--danger)' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen del sistema de inventario</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-value" style={{ color }}>{value}</div>
                <div className="stat-label">{label}</div>
              </div>
              <Icon size={28} style={{ color, opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>

      {(stockBajo?.content?.length ?? 0) > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--warning)' }}>
            ⚠️ Productos con Stock Bajo
          </h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo?.content.map(p => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td><span className="sku">{p.sku}</span></td>
                    <td><span className="badge badge-danger">{p.stock}</span></td>
                    <td>{p.stockMinimo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
