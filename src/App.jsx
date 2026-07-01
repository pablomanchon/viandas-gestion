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

function toLocalDateInput(timestamp) {
  const d = new Date(timestamp)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function hoyLocal() {
  return toLocalDateInput(Date.now())
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M17.414 2.586a2 2 0 0 0-2.828 0L13 4.172 15.828 7l1.586-1.586a2 2 0 0 0 0-2.828Z" />
      <path d="M12 5.586 3 14.586V17.5a.5.5 0 0 0 .5.5H6.5L15.5 8l-3.5-2.414Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
  )
}

function Modal({ onClose, children }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {t.mensaje}
        </div>
      ))}
    </div>
  )
}

function ComandaForm({ onAdd, onClose }) {
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

    onClose()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"
    >
      <div className="flex items-center justify-between sm:col-span-2">
        <h2 className="text-lg font-semibold text-slate-900">Nueva comanda</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <CloseIcon />
        </button>
      </div>

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
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
        >
          Agregar comanda
        </button>
      </div>
    </form>
  )
}

function ComandaRow({ comanda, onToggle, onDelete, onUpdate }) {
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState(comanda.nombre)
  const [apellido, setApellido] = useState(comanda.apellido)
  const [plato, setPlato] = useState(comanda.plato)
  const [detalle, setDetalle] = useState(comanda.detalle)

  function handleDelete() {
    const confirmado = window.confirm(
      `¿Seguro que querés eliminar la comanda de ${comanda.nombre} ${comanda.apellido}?`
    )
    if (confirmado) onDelete(comanda.id)
  }

  function empezarEdicion() {
    setNombre(comanda.nombre)
    setApellido(comanda.apellido)
    setPlato(comanda.plato)
    setDetalle(comanda.detalle)
    setEditando(true)
  }

  function guardarEdicion(e) {
    e.preventDefault()
    if (!nombre.trim() || !apellido.trim() || !plato.trim()) return
    onUpdate(comanda.id, {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      plato: plato.trim(),
      detalle: detalle.trim(),
    })
    setEditando(false)
  }

  if (editando) {
    return (
      <li className="flex flex-col gap-3 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
        <form onSubmit={guardarEdicion} className="flex flex-col gap-2">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Apellido"
            required
          />
          <input
            type="text"
            value={plato}
            onChange={(e) => setPlato(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Plato"
            required
          />
          <input
            type="text"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Detalle"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li
      className={`flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition ${
        comanda.entregado
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-semibold text-slate-900">
            {comanda.nombre} {comanda.apellido}
          </p>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={empezarEdicion}
              aria-label="Editar comanda"
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <PencilIcon />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Eliminar comanda"
              className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
        <p className="truncate text-sm text-slate-700">{comanda.plato}</p>
        {comanda.detalle && (
          <p className="truncate text-sm text-slate-500">{comanda.detalle}</p>
        )}
        <p className="truncate text-xs text-slate-400">
          {new Date(comanda.creadoEn).toLocaleDateString('es-AR')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
      </div>
    </li>
  )
}

function App() {
  const [comandas, setComandas] = useState(loadComandas)
  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [fechaFiltro, setFechaFiltro] = useState(hoyLocal())
  const [modalAbierto, setModalAbierto] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comandas))
  }, [comandas])

  function notificar(mensaje) {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, mensaje }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  function addComanda(comanda) {
    setComandas((prev) => [comanda, ...prev])
    notificar(`Comanda de ${comanda.nombre} ${comanda.apellido} creada`)
  }

  function toggleEntregado(id) {
    const comanda = comandas.find((c) => c.id === id)
    setComandas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, entregado: !c.entregado } : c))
    )
    if (comanda) {
      notificar(
        `${comanda.nombre} ${comanda.apellido} marcado como ${
          comanda.entregado ? 'pendiente' : 'entregado'
        }`
      )
    }
  }

  function deleteComanda(id) {
    const comanda = comandas.find((c) => c.id === id)
    setComandas((prev) => prev.filter((c) => c.id !== id))
    if (comanda) {
      notificar(`Comanda de ${comanda.nombre} ${comanda.apellido} eliminada`)
    }
  }

  function updateComanda(id, cambios) {
    setComandas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...cambios } : c))
    )
    notificar(`Comanda de ${cambios.nombre} ${cambios.apellido} actualizada`)
  }

  const comandasFiltradas = comandas.filter((c) => {
    if (filtro === 'pendientes' && c.entregado) return false
    if (filtro === 'entregadas' && !c.entregado) return false

    if (fechaFiltro && toLocalDateInput(c.creadoEn) !== fechaFiltro) return false

    const nombreCompleto = `${c.nombre} ${c.apellido}`.toLowerCase()
    return nombreCompleto.includes(busqueda.trim().toLowerCase())
  })

  const pendientes = comandas.filter((c) => !c.entregado).length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gestión de Comandas de Viandas
            </h1>
            <p className="mt-1 text-slate-500">
              {comandas.length} comanda{comandas.length !== 1 && 's'} en total ·{' '}
              {pendientes} pendiente{pendientes !== 1 && 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
          >
            <PlusIcon />
            Crear comanda
          </button>
        </header>

        {modalAbierto && (
          <Modal onClose={() => setModalAbierto(false)}>
            <ComandaForm
              onAdd={addComanda}
              onClose={() => setModalAbierto(false)}
            />
          </Modal>
        )}

        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Buscar por nombre o apellido..."
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <button
            type="button"
            onClick={() => setFechaFiltro(hoyLocal())}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              fechaFiltro === hoyLocal()
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => setFechaFiltro('')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              fechaFiltro === ''
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            Todas las fechas
          </button>
        </div>

        <div className="mt-3 mb-3 flex gap-2">
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
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {comandasFiltradas.map((comanda) => (
              <ComandaRow
                key={comanda.id}
                comanda={comanda}
                onToggle={toggleEntregado}
                onDelete={deleteComanda}
                onUpdate={updateComanda}
              />
            ))}
          </ul>
        )}
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  )
}

export default App
