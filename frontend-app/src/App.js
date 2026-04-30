import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import logo from "./assets/logo.png";
import Dashboard from "./Dashboard";
import AdminPanel from "./AdminPanel";
import KanbanBoard from "./KanbanBoard";

const API = "https://ticket-pro-backend.onrender.com";

function App() {

const pushNotif = (msg) => {
  const id = Date.now();

  setNotificaciones((prev) => {
    const nuevas = [{ id, msg }, ...prev].slice(0, 3); // 🔥 máximo 3 visibles
    return nuevas;
  });

  setTimeout(() => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  }, 3000);
};
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState("dashboard");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [tickets, setTickets] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]); // 🔥 NUEVO

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [prioridad, setPrioridad] = useState("Media");
  const [asignado, setAsignado] = useState("Sin asignar");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");

 const hasPermission = (perm) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.permisos?.[perm] === true;
};

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      cargarTickets(res.data);
      cargarUsuarios();
    } catch {
      alert("Credenciales incorrectas");
    }
  };

  const cargarUsuarios = async () => {
    const res = await axios.get(`${API}/users`);
    setUsers(res.data || []);
  };

  const cargarTickets = async (u = user) => {
    if (!u) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/tickets?user=${u.username}&role=${u.role}`
      );

      const nuevos = res.data || [];

      // 🔥 DETECTAR NUEVOS TICKETS
      setTickets((prev) => {
  if (prev.length === 0) return nuevos;

  if (nuevos.length > prev.length) {
    pushNotif("🆕 Nuevo ticket creado");
  }

  return nuevos;
});

    } catch (err) {
      console.error("Error tickets:", err);
      setTickets([]);
    }
    setLoading(false);
  };

  useEffect(() => {
  if (user) {
    cargarTickets();
setView("tickets");
  }
}, [user]);

  const crearTicket = async () => {
    setError("");
    setSuccess("");

    if (!titulo.trim()) return setError("El título es obligatorio");
    if (titulo.length < 5) return setError("El título debe tener al menos 5 caracteres");
    if (!descripcion.trim()) return setError("La descripción es obligatoria");
    if (descripcion.length < 10) return setError("La descripción debe ser más detallada");

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

      // 🔥 NOTIFICACIÓN
pushNotif("🎫 Ticket creado");

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
   await axios.put(`${API}/tickets/${id}/estado`, {
  estado,
  user: user.username
});

    // 🔥 NOTIFICACIÓN
   pushNotif("🔄 Estado actualizado");

    cargarTickets();
  };

  const comentar = async (id, texto) => {
    if (!texto) return;

    await axios.post(`${API}/tickets/${id}/comentario`, {
      usuario: user.username,
      texto
    });

    // 🔥 NOTIFICACIÓN
    pushNotif("💬 Nuevo comentario");

    cargarTickets();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
  disabled={user.role !== "admin"}
                className={`status-select ${t.estado.replace(" ", "-")}`}
                value={t.estado}
                onChange={(e) => cambiarEstado(t._id, e.target.value)}
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
                comentar(t._id, e.target.value);
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

      {/* 🔔 NOTIFICACIONES (NO rompe tu layout) */}
      <div className="notificaciones">
        {notificaciones.slice(0, 3).map((n, i) => (
          <div key={i} className="notif">{n.msg}</div>
        ))}
      </div>

      <div className="sidebar">
        <div className="logo-box">
          <img src={logo} className="logo" alt="logo" />
          <p className="user-name">{user.username}</p>
        </div>

  <div className="menu">
  {hasPermission("dashboard") && <button onClick={() => setView("dashboard")}>Dashboard</button>}
  {hasPermission("create") && <button onClick={() => setView("create")}>Crear</button>}
  {hasPermission("tickets") && (
    <button onClick={() => {
      cargarTickets();
      setView("tickets");
    }}>
      Tickets ({tickets.length})
    </button>
  )}
  {hasPermission("kanban") && <button onClick={() => setView("kanban")}>Kanban</button>}
  {hasPermission("users") && <button onClick={() => setView("users")}>Usuarios</button>}

  {/* 🔥 NUEVO */}
  {hasPermission("ciclicos") && (
    <button onClick={() => setView("ciclicos")}>
      Ciclicos
    </button>
  )}
</div>

        <button className="logout-btn" onClick={logout}>
          Salir
        </button>
      </div>

      <div className="content">

       {view === "dashboard" && hasPermission("dashboard") && (
  <Dashboard key={user?.username} />
)}

{view === "users" && hasPermission("users") && (
  <AdminPanel />
)}

{view === "kanban" && hasPermission("kanban") && (
  <KanbanBoard tickets={tickets} reload={cargarTickets} />
)}

{view === "create" && hasPermission("create") && (
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
                <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prioridad</label>
                  <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                    <option>Baja</option>
                    <option>Media</option>
                    <option>Alta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Asignar a</label>
                  <select value={asignado} onChange={(e) => setAsignado(e.target.value)}>
                    <option>Sin asignar</option>
                    {users.map((u) => (
                      <option key={u._id}>{u.username}</option>
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
{view === "tickets" && hasPermission("tickets") && (
          <div className="card">
            {loading ? <p>Cargando...</p> : ticketsFiltrados.map((t) => (
              <TicketItem key={t._id} t={t} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;