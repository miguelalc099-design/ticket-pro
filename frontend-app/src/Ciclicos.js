import { useState } from "react";
import axios from "axios";

const API = "https://ticket-pro-backend.onrender.com";

function Ciclicos() {

  const [sku, setSku] = useState("");
  const [item, setItem] = useState(null);
  const [lista, setLista] = useState([]);

  const buscar = async () => {
    if (!sku) return;

    try {
      const res = await axios.get(`${API}/inventario/${sku}`);
      setItem(res.data);
    } catch {
      alert("No encontrado");
    }
  };

  const cargarCiclico = async () => {
    try {
      const res = await axios.get(`${API}/ciclicos`);
      setLista(res.data);
    } catch {
      alert("Error al cargar");
    }
  };

  return (
    <div className="card">

      <h2>📦 Módulo Cíclicos</h2>

      {/* 🔍 BUSCADOR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Buscar SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
        <button onClick={buscar}>Buscar</button>

        {item && (
          <div>
            <p><b>Artículo:</b> {item.articulo}</p>
            <p><b>Existencia:</b> {item.existencia}</p>
          </div>
        )}
      </div>

      {/* 📋 BOTÓN */}
      <button onClick={cargarCiclico}>
        Generar Cíclico
      </button>

      {/* 📊 TABLA */}
      <table style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Sistema</th>
            <th>Conteo</th>
            <th>Diferencia</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((i, idx) => (
            <tr key={idx}>
              <td>{i.sku}</td>
              <td>{i.existencia}</td>
              <td>
                <input />
              </td>
              <td>-</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Ciclicos;