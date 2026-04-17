import { useState } from "react";
import axios from "axios";
import "./styles.css";
import logo from "./assets/logo.png";
import Dashboard from "./Dashboard";
import AdminPanel from "./AdminPanel";
import KanbanBoard from "./KanbanBoard";

const API = "http://localhost:3001";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [prioridad, setPrioridad] = useState("Media");
  const [asignado, setAsignado] = useState("Sin asignar");
  const [users, setUsers] = useState([]);

  // 🔥 NUEVO: loader
  const [loading, setLoading] = useState(false);

  // 🔥 VALIDACIONES
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // FILTROS
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");

  const isAdmin = user?.role === "admin";

  // 🔥 NUEVO: permisos reales
  const hasPermission = (perm) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    return user.permisos?.[perm];
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      setUser(res.data);
      cargarTickets(res.data);
      cargarUsuarios();
    } catch {
      alert("Credenciales incorrectas");
    }
  };

  const cargarUsuarios = async () => {
    const res = await axios.get(`${API}/users`);
    setUsers(res.data);
  };

  const cargarTickets = async (u = user) => {
    setLoading(true);
    const res = await axios.get(
      `${API}/tickets?user=${u.username}&role=${u.role}`
    );
    setTickets(res.data);
    setCount(res.data.length);
    setLoading(false);
  };

  const crearTicket = async () => {
    setError("");
    setSuccess("");

    if (!titulo.trim()) {
      setError("El título es obligatorio");
      return;
    }

    if (titulo.length < 5) {
      setError("El título debe tener al menos 5 caracteres");
      return;
    }

    if (!descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    if (descripcion.length < 10) {
      setError("La descripción debe ser más detallada");
      return;
    }

    try {
      await axios.post(`${API}/tickets`, {
        titulo,
        descripcion,
        usuario: user.username,
        prioridad,
        asignado
      });

      setTitulo("");
      setDescripcion("");
      setPrioridad("Media");
      setAsignado("Sin asignar");

      setSuccess("Ticket creado correctamente ✅");

      cargarTickets();

      setTimeout(() => {
        setView("tickets");
        setSuccess("");
      }, 1200);

    } catch {
      setError("Error al crear el ticket");
    }
  };

  const cambiarEstado = async (id, estado) => {
    await axios.put(`${API}/tickets/${id}/estado`, { estado });
    cargarTickets();
  };

  const comentar = async (id, texto) => {
    if (!texto) return;

    await axios.post(`${API}/tickets/${id}/comentario`, {
      usuario: user.username,
      texto
    });

    cargarTickets();
  };

  const logout = () => {
    setUser(null);
    setTickets([]);
  };

  const ticketsFiltrados = tickets.filter(t => {
    const coincideBusqueda =
      t.titulo.toLowerCase().includes(search.toLowerCase()) ||
      t.descripcion.toLowerCase().includes(search.toLowerCase());

    const coincideEstado =
      filtroEstado === "Todos" || t.estado === filtroEstado;

    const coincidePrioridad =
      filtroPrioridad === "Todas" || t.prioridad === filtroPrioridad;

    return coincideBusqueda && coincideEstado && coincidePrioridad;
  });

  const TicketItem = ({ t }) => {
    return (
      <div className="ticket-pro">

        <div className="ticket-header-top">
          <div>
            <div className="label">Título</div>
            <div className="ticket-title">{t.titulo}</div>

            <div className="label">Creado por</div>
            <div className="ticket-user">👤 {t.usuario}</div>
          </div>

          <div className="ticket-top-right">
            <div className="ticket-date">
              🕒 {new Date(t.fecha).toLocaleString()}
            </div>

            <div>
              <div className="label">Estatus</div>
              <select
                className={`status-select ${t.estado.replace(" ", "-")}`}
                value={t.estado}
                onChange={(e) => cambiarEstado(t.id, e.target.value)}
              >
                <option>Abierto</option>
                <option>En proceso</option>
                <option>Cerrado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="ticket-grid">
          <div>
            <span className="label">Prioridad</span>
            <div className={`priority ${t.prioridad}`}>
              {t.prioridad}
            </div>
          </div>

          <div>
            <span className="label">Asignado</span>
            <div className="assigned">👤 {t.asignado}</div>
          </div>
        </div>

        <div className="ticket-description">
          <span className="label">Descripción</span>
          <p>{t.descripcion}</p>
        </div>

        <div className="comments">
          {t.comentarios?.map((c, i) => (
            <div key={i} className="comment">
              <div className="comment-header">
                <b>{c.usuario}</b>
                <span>{new Date(c.fecha).toLocaleString()}</span>
              </div>
              <div>{c.texto}</div>
            </div>
          ))}

          <textarea
            className="comment-input"
            placeholder="Escribir comentario..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                comentar(t.id, e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>

      </div>
    );
  };

  if (!user) {
    return (
      <div className="login-saas">
        <div className="login-left">
          <h1>Ticket System</h1>
          <p>Gestión inteligente de tickets</p>
        </div>

        <div className="login-right">
          <div className="login-card-pro">
            <img src={logo} className="logo-login" alt="logo" />
            <h2>Iniciar sesión</h2>

            <input placeholder="Usuario" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />

            <button onClick={login}>Entrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">

      <div className="sidebar">
        <div className="logo-box">
          <img src={logo} className="logo" alt="logo" />
          <p className="user-name">{user.username}</p>
        </div>

        <div className="menu">
          {hasPermission("dashboard") && <button onClick={() => setView("dashboard")}>Dashboard</button>}
          {hasPermission("create") && <button onClick={() => setView("create")}>Crear</button>}
          {hasPermission("tickets") && (
            <button onClick={() => setView("tickets")}>
              Tickets ({ticketsFiltrados.length})
            </button>
          )}
          {hasPermission("kanban") && <button onClick={() => setView("kanban")}>Kanban</button>}
          {hasPermission("users") && <button onClick={() => setView("users")}>Usuarios</button>}
        </div>

        <button className="logout-btn" onClick={logout}>
  Salir
</button>
      </div>

      <div className="content">

        {view === "dashboard" && <Dashboard />}
        {view === "users" && <AdminPanel />}
        {view === "kanban" && <KanbanBoard tickets={tickets} reload={cargarTickets} />}

        {view === "create" && (
  <div className="form-wrapper">
    <div className="form-card-pro">

      <div className="form-header">
        <h2>🎫 Crear Ticket</h2>
        <p>Registra un nuevo incidente o solicitud</p>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="form-group">
        <label>Título</label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: Falla en sistema de facturación"
        />
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe el problema con detalle..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Prioridad</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
          </select>
        </div>

        <div className="form-group">
          <label>Asignar a</label>
          <select
            value={asignado}
            onChange={(e) => setAsignado(e.target.value)}
          >
            <option>Sin asignar</option>
            {users.map((u) => (
              <option key={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn-primary" onClick={crearTicket}>
        Crear Ticket
      </button>

    </div>
  </div>
)}
        {view === "tickets" && (
          <div className="card">

            <div className="filters-bar">
              <input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />

              <select onChange={(e) => setFiltroEstado(e.target.value)}>
                <option>Todos</option>
                <option>Abierto</option>
                <option>En proceso</option>
                <option>Cerrado</option>
              </select>

              <select onChange={(e) => setFiltroPrioridad(e.target.value)}>
                <option>Todas</option>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </div>

            {loading ? (
              <p>Cargando tickets...</p>
            ) : (
              ticketsFiltrados.map((t) => (
                <TicketItem key={t.id} t={t} />
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;