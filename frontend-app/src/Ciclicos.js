import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API = "https://ticket-pro-backend.onrender.com";

function Ciclicos() {

  const [modo, setModo] = useState("inicio");
  const [sku, setSku] = useState("");
  const [item, setItem] = useState(null);
  const [captura, setCaptura] = useState([]);
  const [conteo, setConteo] = useState("");

  // 📥 INVENTARIO
  const subirExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    const limpio = json.map(row => ({
      sku: row["Código del artículo"] || row["Codigo"] || row["SKU"],
      articulo: row["Artículo"] || row["Descripcion"],
      existencia: row["Existencia"] || 0
    }));

    await axios.post(`${API}/inventario/upload`, { data: limpio });

    alert("Inventario cargado 🔥");
  };

  // 📋 CATALOGO
  const subirCatalogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    const limpio = json.map(row => ({
      sku: row["Código del artículo"] || row["Codigo"] || row["SKU"],
      articulo: row["Artículo"] || row["Descripcion"]
    }));

    await axios.post(`${API}/catalogo/upload`, { data: limpio });

    alert("Catálogo cargado 🔥");
  };

  // 🔍 BUSCAR NORMAL
  const buscar = async () => {
    if (!sku) return;

    try {
      const res = await axios.get(`${API}/inventario/${sku}`);
      setItem(res.data);
    } catch {
      alert("No encontrado");
    }
  };

  // 🔍 BUSCAR CICLICO (CON CATALOGO)
  const buscarParaCiclico = async () => {
    if (!sku) return;

    try {
      const res = await axios.get(`${API}/inventario/${sku}`);

      if (res.data) {
        setItem(res.data);
        return;
      }

      const cat = await axios.get(`${API}/catalogo/${sku}`);

      if (cat.data) {
        setItem({
          sku,
          articulo: cat.data.articulo,
          existencia: 0
        });
        alert("SKU sin existencia");
        return;
      }

      alert("SKU no existe");

    } catch {
      alert("Error conexión");
    }
  };

  // ➕ AGREGAR
  const agregar = () => {
    if (!item || conteo === "") return;

    if (captura.find(i => i.sku === item.sku)) {
      alert("SKU ya capturado");
      return;
    }

    const nuevo = {
      sku: item.sku,
      articulo: item.articulo,
      sistema: item.existencia,
      conteo: Number(conteo)
    };

    setCaptura([...captura, nuevo]);

    setSku("");
    setItem(null);
    setConteo("");
  };

  return (
    <div className="card">

      <h2>📦 Módulo Cíclicos</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>📥 Inventario</label><br />
        <input type="file" onChange={subirExcel} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>📋 Catálogo</label><br />
        <input type="file" onChange={subirCatalogo} />
      </div>

      {modo === "inicio" && (
        <>
          <input value={sku} onChange={(e) => setSku(e.target.value)} />
          <button onClick={buscar}>Buscar</button>

          <button onClick={() => setModo("captura")}>
            Nuevo Cíclico
          </button>
        </>
      )}

      {modo === "captura" && (
        <>
          <input value={sku} onChange={(e) => setSku(e.target.value)} />
          <button onClick={buscarParaCiclico}>Buscar</button>

          {item && (
            <div>
              <p>{item.articulo}</p>
              <p>Sistema: {item.existencia}</p>

              <input
                value={conteo}
                onChange={(e) => setConteo(e.target.value)}
              />

              <button onClick={agregar}>Agregar</button>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Sistema</th>
                <th>Conteo</th>
                <th>Diferencia</th>
              </tr>
            </thead>

            <tbody>
              {captura.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.sku}</td>
                  <td>{i.sistema}</td>
                  <td>{i.conteo}</td>
                  <td>{i.conteo - i.sistema}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setModo("inicio")}>
            Terminar
          </button>
        </>
      )}
    </div>
  );
}

export default Ciclicos;