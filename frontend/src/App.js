import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const API = "http://localhost:3001";

  const cargarTickets = async () => {
    const res = await axios.get(`${API}/tickets`);
    setTickets(res.data);
  };

  const crearTicket = async () => {
    if (!titulo || !descripcion) return;

    await axios.post(`${API}/tickets`, {
      titulo,
      descripcion,
    });

    setTitulo("");
    setDescripcion("");
    cargarTickets();
  };

  useEffect(() => {
    cargarTickets();
  }, []);

  return (
    <div className="app">
      {/* HEADER */}
      <div className="header">
        <h1>🎫 Sistema de Tickets</h1>
        <p>Panel de soporte interno</p>
      </div>

      {/* FORM */}
      <div className="card">
        <h2>Crear ticket</h2>

        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button onClick={crearTicket}>+ Crear ticket</button>
      </div>

      {/* LISTA */}
      <div className="card">
        <h2>Tickets</h2>

        {tickets.length === 0 ? (
          <p className="empty">No hay tickets todavía</p>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="ticket">
              <div>
                <h3>{t.titulo}</h3>
                <p>{t.descripcion}</p>
              </div>

              <span className="status">Abierto</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;