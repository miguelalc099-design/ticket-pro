import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ticket-pro-backend.onrender.com";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState({});

  const loadUsers = async () => {
    const res = await axios.get(`${API}/users`);
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async () => {
    if (!username || !password) return;

    await axios.post(`${API}/users`, { username, password });

    setUsername("");
    setPassword("");
    loadUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API}/users/${id}`);
    loadUsers();
  };

  const changePassword = async (id) => {
    const newPass = prompt("Nueva contraseña:");
    if (!newPass) return;

    await axios.put(`${API}/users/${id}/password`, {
      password: newPass
    });

    loadUsers();
  };

  const togglePermiso = async (user, key) => {
    const updated = {
      ...user,
      permisos: {
        ...user.permisos,
        [key]: !user.permisos?.[key]
      }
    };

    await axios.put(`${API}/users/${user._id}`, updated);
    loadUsers();
  };

  const toggleShowPass = (id) => {
    setShowPass(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="card">
      <h2>👤 Gestión de Usuarios</h2>

      {/* CREAR */}
      <div className="user-form">
        <input
          placeholder="Nuevo usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={createUser}>Crear</button>
      </div>

      {/* TABLA */}
      <div className="users-table">

        <div className="users-header">
          <span>Usuario</span>
          <span>Rol</span>
          <span>Password</span>
          <span>Permisos</span>
          <span>Acciones</span>
        </div>

        {users.map((u) => (
          <div key={u._id} className="users-row">

            {/* USER */}
            <div className="user-info">
              <div className="avatar">
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div>{u.username}</div>
            </div>

            {/* ROLE */}
            <div>
              <span className={`role ${u.role}`}>
                {u.role}
              </span>
            </div>

            {/* PASSWORD */}
            <div className="user-password">
              <span>
                {showPass[u._id] ? u.password : "••••••••"}
              </span>

              <button onClick={() => toggleShowPass(u._id)}>
                👁
              </button>
            </div>

            {/* PERMISOS */}
            <div className="permisos">
              {["dashboard","tickets","create","kanban","users"].map((p) => (
                <label key={p}>
                  <input
                    type="checkbox"
                    checked={u.permisos?.[p] || false}
                    onChange={() => togglePermiso(u, p)}
                  />
                  {p}
                </label>
              ))}
            </div>

            {/* ACCIONES */}
            <div className="user-actions">
              <button onClick={() => changePassword(u._id)}>
                🔑
              </button>

              <button onClick={() => deleteUser(u._id)}>
                ❌
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default AdminPanel;