import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API = "http://localhost:3001";

function Dashboard() {
  const [data, setData] = useState(null);
  const [tickets, setTickets] = useState([]);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const load = async (params = {}) => {
    const resStats = await axios.get(`${API}/stats`, { params });
    const resTickets = await axios.get(`${API}/tickets?role=admin`);

    let filteredTickets = resTickets.data;

    // 🔥 aplicar filtro también a tickets
    if (params.start && params.end) {
      const startDate = new Date(params.start);
      const endDate = new Date(params.end);

      filteredTickets = filteredTickets.filter(t => {
        const fecha = new Date(t.fecha);
        return fecha >= startDate && fecha <= endDate;
      });
    }

    setData(resStats.data);
    setTickets(filteredTickets);
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setStart("");
    setEnd("");
    load();
  };

  if (!data) return <div className="card">Cargando...</div>;

  // KPIs (ahora sí filtrados)
  const total = tickets.length;
  const abiertos = tickets.filter(t => t.estado === "Abierto").length;
  const proceso = tickets.filter(t => t.estado === "En proceso").length;
  const cerrados = tickets.filter(t => t.estado === "Cerrado").length;
  const alta = tickets.filter(t => t.prioridad === "Alta").length;

  return (
    <div className="fade">

      <h2>📊 Dashboard</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Resumen general de tickets
      </p>

      {/* KPIs */}
      <div className="kpis">
        <div className="kpi blue"><h3>{total}</h3><p>Total</p></div>
        <div className="kpi yellow"><h3>{abiertos}</h3><p>Abiertos</p></div>
        <div className="kpi orange"><h3>{proceso}</h3><p>En proceso</p></div>
        <div className="kpi green"><h3>{cerrados}</h3><p>Cerrados</p></div>
        <div className="kpi red"><h3>{alta}</h3><p>Alta prioridad</p></div>
      </div>

      {/* 🔥 FILTROS CORRECTOS */}
      <div className="card">
        <div className="filters">
          <input
            type="date"
            value={start}
            onChange={e => setStart(e.target.value)}
          />

          <input
            type="date"
            value={end}
            onChange={e => setEnd(e.target.value)}
          />

          <button onClick={() => load({ start, end })}>
            Aplicar
          </button>

          {/* 🔥 BOTÓN QUE PEDISTE */}
          <button onClick={reset}>
            Ver todo
          </button>
        </div>
      </div>

      {/* ESTADO */}
      <div className="card">
        <h4>📌 Estado de tickets</h4>
        <Bar
          data={{
            labels: ["Abiertos", "En proceso", "Cerrados"],
            datasets: [{
              data: [abiertos, proceso, cerrados],
              backgroundColor: ["#3b82f6", "#facc15", "#22c55e"],
              borderRadius: 6
            }]
          }}
        />
      </div>

      {/* SEMANA */}
      <div className="card">
        <h4>📅 Tickets por semana</h4>
        <Bar
          data={{
            labels: data.porSemana.map(d => d.semana),
            datasets: [{
              data: data.porSemana.map(d => d.total),
              backgroundColor: "#f97316",
              borderRadius: 6
            }]
          }}
        />
      </div>

      {/* USUARIO */}
      <div className="card">
        <h4>👤 Tickets por usuario</h4>
        <Bar
          data={{
            labels: data.porUsuario.map(d => d.usuario),
            datasets: [{
              data: data.porUsuario.map(d => d.total),
              backgroundColor: "#3b82f6",
              borderRadius: 6
            }]
          }}
        />
      </div>

      {/* MES */}
      <div className="card">
        <h4>📆 Tickets por mes</h4>
        <Bar
          data={{
            labels: data.porMes.map(d => d.mes),
            datasets: [{
              data: data.porMes.map(d => d.total),
              backgroundColor: "#22c55e",
              borderRadius: 6
            }]
          }}
        />
      </div>

      {/* PRIORIDAD */}
      <div className="card">
        <h4>🔥 Tickets por prioridad</h4>
        <Bar
          data={{
            labels: data.porPrioridad.map(d => d.prioridad),
            datasets: [{
              data: data.porPrioridad.map(d => d.total),
              backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
              borderRadius: 6
            }]
          }}
        />
      </div>

    </div>
  );
}

export default Dashboard;