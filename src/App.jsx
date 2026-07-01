import { useEffect, useState } from 'react'

const STORAGE_KEY = 'viandas-comandas'

function loadComandas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function ComandaForm({ onAdd }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [plato, setPlato] = useState('')
  const [detalle, setDetalle] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim() || !apellido.trim() || !plato.trim()) return

    onAdd({
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      plato: plato.trim(),
      detalle: detalle.trim(),
      entregado: false,
      creadoEn: Date.now(),
    })

    setNombre('')
    setApellido('')
    setPlato('')
    setDetalle('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Juan"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Apellido
        </label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Pérez"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Plato
        </label>
        <input
          type="text"
          value={plato}
          onChange={(e) => setPlato(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Milanesa con puré"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Detalle
        </label>
        <input
          type="text"
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Sin sal, retira a las 13hs"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 sm:w-auto"
        >
          Agregar comanda
        </button>
      </div>
    </form>
  )
}

function ComandaRow({ comanda, onToggle, onDelete }) {
  return (
    <li
      className={`flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition sm:flex-row sm:items-center sm:justify-between ${
        comanda.entregado
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">
          {comanda.nombre} {comanda.apellido}
        </p>
        <p className="truncate text-sm text-slate-700">{comanda.plato}</p>
        {comanda.detalle && (
          <p className="truncate text-sm text-slate-500">{comanda.detalle}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            comanda.entregado
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {comanda.entregado ? 'Entregado' : 'Pendiente'}
        </span>
        <button
          type="button"
          onClick={() => onToggle(comanda.id)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          {comanda.entregado ? 'Marcar pendiente' : 'Marcar entregado'}
        </button>
        <button
          type="button"
          onClick={() => onDelete(comanda.id)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}

function App() {
  const [comandas, setComandas] = useState(loadComandas)
  const [filtro, setFiltro] = useState('todas')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comandas))
  }, [comandas])

  function addComanda(comanda) {
    setComandas((prev) => [comanda, ...prev])
  }

  function toggleEntregado(id) {
    setComandas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, entregado: !c.entregado } : c))
    )
  }

  function deleteComanda(id) {
    setComandas((prev) => prev.filter((c) => c.id !== id))
  }

  const comandasFiltradas = comandas.filter((c) => {
    if (filtro === 'pendientes') return !c.entregado
    if (filtro === 'entregadas') return c.entregado
    return true
  })

  const pendientes = comandas.filter((c) => !c.entregado).length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Gestión de Comandas de Viandas
          </h1>
          <p className="mt-1 text-slate-500">
            {comandas.length} comanda{comandas.length !== 1 && 's'} en total ·{' '}
            {pendientes} pendiente{pendientes !== 1 && 's'}
          </p>
        </header>

        <ComandaForm onAdd={addComanda} />

        <div className="mt-6 mb-3 flex gap-2">
          {[
            { key: 'todas', label: 'Todas' },
            { key: 'pendientes', label: 'Pendientes' },
            { key: 'entregadas', label: 'Entregadas' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setFiltro(opt.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filtro === opt.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {comandasFiltradas.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-slate-400">
            No hay comandas para mostrar.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {comandasFiltradas.map((comanda) => (
              <ComandaRow
                key={comanda.id}
                comanda={comanda}
                onToggle={toggleEntregado}
                onDelete={deleteComanda}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
