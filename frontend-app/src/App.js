import { useState, useEffect } from "react";

import axios from "axios";

import "./styles.css";

import logo from "./assets/logo.png";

import Dashboard from "./Dashboard";

import AdminPanel from "./AdminPanel";

import KanbanBoard from "./KanbanBoard";

import Ciclicos from "./Ciclicos";

import InventarioIT
from "./components/inventarioIT/InventarioIT";

import {
  ToastContainer,
  toast
} from "react-toastify";
import LavadoUnidades
from "./components/lavadoUnidades/LavadoUnidades";

import "react-toastify/dist/ReactToastify.css";

/* =========================================
   API
========================================= */

const API =
  "https://ticket-pro-backend.onrender.com";

/* =========================================
   APP
========================================= */

function App() {

/* =========================================
   AUTH
========================================= */

const [user, setUser] =
  useState(() => {

    const saved =
      localStorage.getItem("user");

    return saved
      ? JSON.parse(saved)
      : null;

  });

/* =========================================
   UI STATES
========================================= */

const [view, setView] =
  useState("dashboard");
const [
  sidebarOpen,
  setSidebarOpen
] = useState(false);

const [loading, setLoading] =
  useState(false);

const [error, setError] =
  useState("");

const [success, setSuccess] =
  useState("");

const [notificaciones,
  setNotificaciones] =
  useState([]);

/* =========================================
   LOGIN
========================================= */

const [username,
  setUsername] =
  useState("");

const [password,
  setPassword] =
  useState("");

/* =========================================
   TICKETS
========================================= */

const [tickets, setTickets] =
  useState([]);

const [titulo, setTitulo] =
  useState("");

const [descripcion,
  setDescripcion] =
  useState("");

const [prioridad,
  setPrioridad] =
  useState("Media");

const [asignado,
  setAsignado] =
  useState("Sin asignar");

/* =========================================
   USERS
========================================= */

const [users, setUsers] =
  useState([]);

/* =========================================
   FILTROS
========================================= */

const [search, setSearch] =
  useState("");

const [filtroEstado,
  setFiltroEstado] =
  useState("Todos");

const [filtroPrioridad,
  setFiltroPrioridad] =
  useState("Todas");

/* =========================================
   HELPERS
========================================= */

const pushNotif = (msg) => {

  const id = Date.now();

  setNotificaciones((prev) => {

    const nuevas = [
      { id, msg },
      ...prev
    ].slice(0, 3);

    return nuevas;

  });

  setTimeout(() => {

    setNotificaciones((prev) =>

      prev.filter((n) =>
        n.id !== id
      )

    );

  }, 3000);

};

const hasPermission =
  (perm) => {

  if (!user)
    return false;

  if (user.role === "admin")
    return true;

  return (
    user.permisos?.[perm] ===
    true
  );

};

/* =========================================
   LOGIN
========================================= */

const login =
  async () => {

  try {

    if (
      !username ||
      !password
    ) {

      toast.error(
        "Completa usuario y contraseña"
      );

      return;
    }

    const res =
      await axios.post(

        `${API}/login`,

        {
          username,
          password
        }

      );

    setUser(res.data);

    localStorage.setItem(
      "user",
      JSON.stringify(res.data)
    );

    toast.success(
      `Bienvenido ${res.data.username}`
    );

    cargarTickets(res.data);

    cargarUsuarios();

  } catch (err) {

    console.log(err);

    toast.error(
      "Credenciales incorrectas"
    );

  }

};

/* =========================================
   LOGOUT
========================================= */

const logout = () => {

  localStorage.removeItem(
    "user"
  );

  setUser(null);

  setTickets([]);

  setView("dashboard");

  toast.info(
    "Sesión cerrada"
  );

};

/* =========================================
   USERS
========================================= */

const cargarUsuarios =
  async () => {

  try {

    const res =
      await axios.get(
        `${API}/users`
      );

    setUsers(
      res.data || []
    );

  } catch (err) {

    console.log(err);

  }

};

/* =========================================
   TICKETS
========================================= */

const cargarTickets =
  async (u = user) => {

  if (!u) return;

  setLoading(true);

  try {

    const res =
      await axios.get(
        `${API}/tickets`
      );

    const nuevos =
      res.data || [];

    setTickets((prev) => {

      if (
        prev.length > 0 &&
        nuevos.length > prev.length
      ) {

        pushNotif(
          "🆕 Nuevo ticket creado"
        );

      }

      return nuevos;

    });

  } catch (err) {

    console.log(err);

    toast.error(
      "Error cargando tickets"
    );

  } finally {

    setLoading(false);

  }

};

/* =========================================
   CREAR TICKET
========================================= */

const crearTicket =
  async () => {

  setError("");

  setSuccess("");

  if (!titulo.trim()) {

    setError(
      "El título es obligatorio"
    );

    return;
  }

  if (
    titulo.length < 5
  ) {

    setError(
      "Título demasiado corto"
    );

    return;
  }

  if (
    !descripcion.trim()
  ) {

    setError(
      "La descripción es obligatoria"
    );

    return;
  }

  if (
    descripcion.length < 10
  ) {

    setError(
      "La descripción debe ser más detallada"
    );

    return;
  }

  try {

    await axios.post(
      `${API}/tickets`,
      {

        titulo,

        descripcion,

        usuario:
          user.username,

        prioridad,

        asignado

      }
    );

    setTitulo("");

    setDescripcion("");

    setPrioridad("Media");

    setAsignado(
      "Sin asignar"
    );

    setSuccess(
      "Ticket creado correctamente"
    );

    pushNotif(
      "🎫 Ticket creado"
    );

    toast.success(
      "Ticket creado"
    );

    cargarTickets();

    setTimeout(() => {

      setView("tickets");

      setSuccess("");

    }, 1000);

  } catch (err) {

    console.log(err);

    setError(
      "Error creando ticket"
    );

  }

};

/* =========================================
   CAMBIAR ESTADO
========================================= */

const cambiarEstado =
  async (id, estado) => {

  try {

    await axios.put(

      `${API}/tickets/${id}/estado`,

      {

        estado,

        user:
          user.username

      }

    );

    pushNotif(
      "🔄 Estado actualizado"
    );

    toast.success(
      "Estado actualizado"
    );

    cargarTickets();

  } catch (err) {

    console.log(err);

    toast.error(
      "Error cambiando estado"
    );

  }

};

/* =========================================
   COMENTARIOS
========================================= */

const comentar =
  async (id, texto) => {

  if (!texto.trim())
    return;

  try {

    await axios.post(

      `${API}/tickets/${id}/comentario`,

      {

        usuario:
          user.username,

        texto

      }

    );

    pushNotif(
      "💬 Nuevo comentario"
    );

    cargarTickets();

  } catch (err) {

    console.log(err);

    toast.error(
      "Error comentando"
    );

  }

};

/* =========================================
   EFFECTS
========================================= */

useEffect(() => {

  if (user) {

    cargarTickets();

    cargarUsuarios();

    setView("tickets");

  }

}, [user]);

/* =========================================
   FILTROS
========================================= */

const ticketsFiltrados =
  tickets.filter((t) => {

    const coincideBusqueda =

      t.titulo
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      t.descripcion
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const coincideEstado =

      filtroEstado ===
      "Todos"

      ||

      t.estado ===
      filtroEstado;

    const coincidePrioridad =

      filtroPrioridad ===
      "Todas"

      ||

      t.prioridad ===
      filtroPrioridad;

    return (

      coincideBusqueda &&
      coincideEstado &&
      coincidePrioridad

    );

  });

/* =========================================
   TICKET ITEM
========================================= */

const TicketItem =
  ({ t }) => {

  return (

<div className="ticket-pro">

<div className="ticket-header-top">

<div>

<div className="label">
  Título
</div>

<div className="ticket-title">
  {t.titulo}
</div>

<div className="label">
  Creado por
</div>

<div className="ticket-user">
  👤 {t.usuario}
</div>

</div>

<div className="ticket-top-right">

<div className="ticket-date">
  🕒 {
    new Date(t.fecha)
    .toLocaleString()
  }
</div>

<div>

<div className="label">
  Estatus
</div>

<select

  disabled={
    user.role !== "admin"
  }

  className={`status-select ${t.estado.replace(" ", "-")}`}

  value={t.estado}

  onChange={(e) =>

    cambiarEstado(
      t._id,
      e.target.value
    )

  }
>

<option>
  Abierto
</option>

<option>
  En proceso
</option>

<option>
  Cerrado
</option>

</select>

</div>

</div>

</div>

<div className="ticket-grid">

<div>

<span className="label">
  Prioridad
</span>

<div
  className={`priority ${t.prioridad}`}
>
  {t.prioridad}
</div>

</div>

<div>

<span className="label">
  Asignado
</span>

<div className="assigned">
  👤 {t.asignado}
</div>

</div>

</div>

<div className="ticket-description">

<span className="label">
  Descripción
</span>

<p>
  {t.descripcion}
</p>

</div>

<div className="comments">

{t.comentarios?.map(
  (c, i) => (

<div
  key={i}
  className="comment"
>

<div className="comment-header">

<b>
  {c.usuario}
</b>

<span>
{
  new Date(c.fecha)
  .toLocaleString()
}
</span>

</div>

<div>
  {c.texto}
</div>

</div>

))}

<textarea

  className="comment-input"

  placeholder="Escribir comentario..."

  onKeyDown={(e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      comentar(
        t._id,
        e.target.value
      );

      e.target.value = "";

    }

  }}
/>

</div>

</div>

);

};

/* =========================================
   LOGIN SCREEN
========================================= */

if (!user) {

  return (

<div className="login-saas">

<div className="login-left">

<h1>
  Ticket System
</h1>

<p>
  Gestión inteligente de tickets
</p>

</div>

<div className="login-right">

<div className="login-card-pro">

<img
  src={logo}
  className="logo-login"
  alt="logo"
/>

<h2>
  Iniciar sesión
</h2>

<input

  placeholder="Usuario"

  value={username}

  onChange={(e) =>
    setUsername(
      e.target.value
    )
  }
/>

<input

  type="password"

  placeholder="Contraseña"

  value={password}

  onChange={(e) =>
    setPassword(
      e.target.value
    )
  }

  onKeyDown={(e) => {

    if (e.key === "Enter") {
      login();
    }

  }}
/>

<button
  onClick={login}
>
  Entrar
</button>

</div>

</div>

</div>

);

}

/* =========================================
   APP
========================================= */

return (

<>

<button
  className="mobile-menu-btn"

  onClick={() =>
    setSidebarOpen(true)
  }
>
  ☰
</button>

<div className="layout">

{/* NOTIFICACIONES */}

<div className="notificaciones">

{notificaciones
  .slice(0, 3)
  .map((n) => (

<div
  key={n.id}
  className="notif"
>
  {n.msg}
</div>

))}

</div>
{
sidebarOpen && (

<div
  className="sidebar-overlay"

  onClick={() =>
    setSidebarOpen(false)
  }
/>

)}
{/* SIDEBAR */}

<div
  className={`sidebar ${
    sidebarOpen
      ? "sidebar-open"
      : ""
  }`}
>

<div className="logo-box">

<img
  src={logo}
  className="logo"
  alt="logo"
/>

<p className="user-name">
  {user.username}
</p>

<button
  className="logout-btn"
  onClick={logout}
>
  Salir
</button>

</div>

<div className="menu">

{hasPermission(
  "dashboard"
) && (

<button
 onClick={() => {

  setView("dashboard");

  setSidebarOpen(false);

}}
>
  📊 Dashboard
</button>

)}

{hasPermission(
  "create"
) && (

<button
  onClick={() => {

  setView("create");

  setSidebarOpen(false);

}}
>
  🎫 Crear
</button>

)}

{hasPermission(
  "tickets"
) && (

<button

  onClick={() => {

    cargarTickets();

    setView("tickets");
setSidebarOpen(false);

  }}
>

  Tickets (
    {tickets.length}
  )

</button>

)}

{hasPermission(
  "kanban"
) && (

<button
  onClick={() => {

  setView("kanban");

  setSidebarOpen(false);

}}
>
  📋 Kanban
</button>

)}

{hasPermission(
  "users"
) && (

<button
  onClick={() => {

  setView("users");

  setSidebarOpen(false);

}}
>
  👥 Usuarios
</button>

)}

{hasPermission(
  "ciclicos"
) && (

<button
  onClick={() => {

  setView("ciclicos");

  setSidebarOpen(false);

}}
>
  📦 Cíclicos
</button>

)}

{hasPermission(
  "inventarioIT"
) && (

<button
  onClick={() => {

  setView("inventarioIT");

  setSidebarOpen(false);

}}
>
  💻 Inventario IT
</button>

)}

{hasPermission(
  "lavados"
) && (

<button
  onClick={() => {

  setView("lavados");

  setSidebarOpen(false);

}}
>
  🚛 Lavados
</button>

)}

</div>



</div>

{/* CONTENT */}

<div className="content">

{/* DASHBOARD */}

{view === "dashboard" &&
 hasPermission(
  "dashboard"
 ) && (

<Dashboard
  key={user?.username}
/>

)}

{/* USERS */}

{view === "users" &&
 hasPermission(
  "users"
 ) && (

<AdminPanel />

)}

{/* CICLICOS */}

{view === "ciclicos" &&
 hasPermission(
  "ciclicos"
 ) && (

<Ciclicos
  user={user}
/>

)}

{/* INVENTARIO IT */}

{view === "inventarioIT" &&
 hasPermission(
  "inventarioIT"
 ) && (

<InventarioIT />

)}

{/* LAVADOS */}

{view === "lavados" &&
 hasPermission(
  "lavados"
 ) && (

<LavadoUnidades />

)}

{/* KANBAN */}

{view === "kanban" &&
 hasPermission(
  "kanban"
 ) && (

<KanbanBoard

  tickets={tickets}

  reload={cargarTickets}

/>

)}

{/* CREAR */}

{view === "create" &&
 hasPermission(
  "create"
 ) && (

<div className="form-wrapper">

<div className="form-card-pro">

<div className="form-header">

<h2>
  🎫 Crear Ticket
</h2>

<p>
  Registra un nuevo incidente
</p>

</div>

{error && (
<div className="alert error">
  {error}
</div>
)}

{success && (
<div className="alert success">
  {success}
</div>
)}

<div className="form-group">

<label>
  Título
</label>

<input

  value={titulo}

  onChange={(e) =>
    setTitulo(
      e.target.value
    )
  }
/>

</div>

<div className="form-group">

<label>
  Descripción
</label>

<textarea

  value={descripcion}

  onChange={(e) =>
    setDescripcion(
      e.target.value
    )
  }
/>

</div>

<div className="form-row">

<div className="form-group">

<label>
  Prioridad
</label>

<select

  value={prioridad}

  onChange={(e) =>
    setPrioridad(
      e.target.value
    )
  }
>

<option>
  Baja
</option>

<option>
  Media
</option>

<option>
  Alta
</option>

</select>

</div>

<div className="form-group">

<label>
  Asignar a
</label>

<select

  value={asignado}

  onChange={(e) =>
    setAsignado(
      e.target.value
    )
  }
>

<option>
  Sin asignar
</option>

{users.map((u) => (

<option
  key={u._id}
>
  {u.username}
</option>

))}

</select>

</div>

</div>

<button
  className="btn-primary"
  onClick={crearTicket}
>
  Crear Ticket
</button>

</div>

</div>

)}

{/* TICKETS */}

{view === "tickets" &&
 hasPermission(
  "tickets"
 ) && (

<div className="card">

{/* FILTROS */}

<div
  style={{
    display: "grid",
    gap: "14px",
    marginBottom: "24px"
  }}
>

<input

  className="input-pro"

  placeholder="🔍 Buscar ticket..."

  value={search}

  onChange={(e) =>
    setSearch(
      e.target.value
    )
  }
/>

<div
  style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  }}
>

<select

  className="input-pro"

  value={filtroEstado}

  onChange={(e) =>
    setFiltroEstado(
      e.target.value
    )
  }
>

<option>
  Todos
</option>

<option>
  Abierto
</option>

<option>
  En proceso
</option>

<option>
  Cerrado
</option>

</select>

<select

  className="input-pro"

  value={filtroPrioridad}

  onChange={(e) =>
    setFiltroPrioridad(
      e.target.value
    )
  }
>

<option>
  Todas
</option>

<option>
  Baja
</option>

<option>
  Media
</option>

<option>
  Alta
</option>

</select>

</div>

</div>

{/* LISTA */}

{loading ? (

<p>
  Cargando...
</p>

) : ticketsFiltrados.length === 0 ? (

<p>
  No hay tickets.
</p>

) : (

ticketsFiltrados.map((t) => (

<TicketItem
  key={t._id}
  t={t}
/>

))

)}

</div>

)}

</div>

{/* TOAST */}

<ToastContainer

  position="top-right"

  autoClose={2500}

  theme="dark"

/>

</div>

</>

);

}

export default App;