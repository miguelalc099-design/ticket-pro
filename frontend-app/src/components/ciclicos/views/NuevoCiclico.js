function NuevoCiclico({

  titulo,
  setTitulo,

  fecha,
  setFecha,

  crearCiclico,

  loading,

  setModo

}) {

  return (
<>

<h3>➕ Nuevo Cíclico</h3>

<input
  className="input-pro"
  placeholder="📝 Título del cíclico"
  value={titulo}

  onChange={(e) =>
    setTitulo(e.target.value)
  }
/>

<br /><br />

<input
  className="input-pro"
  type="date"
  value={fecha}

  onChange={(e) =>
    setFecha(e.target.value)
  }
/>

<br /><br />

<button
  className="btn-pro"
  onClick={crearCiclico}
  disabled={loading}
>
  {loading
    ? "⏳ Creando..."
    : "🚀 Iniciar Cíclico"}
</button>

<button
  className="btn-pro btn-secondary"
  style={{ marginLeft: "10px" }}

  onClick={() =>
    setModo("lista")
  }
>
  Cancelar
</button>

</>
  );
}

export default NuevoCiclico;