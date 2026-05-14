function KPIsResumen({
  totalSKUs,
  totalDiferencias,
  sobrantes,
  faltantes,
  ajusteTotal,
  setFiltroTabla
}) {

  return (

<>
<div style={{ marginTop: "25px" }}>

<div className="kpis">

  <div className="kpi blue">
    <h3>{totalSKUs}</h3>
    <p>Total SKUs</p>
  </div>

  <div className="kpi yellow">
    <h3>{totalDiferencias}</h3>
    <p>Diferencias</p>
  </div>

  <div className="kpi green">
    <h3>
      $
      {sobrantes.toLocaleString()}
    </h3>

    <p>Sobrantes</p>
  </div>

  <div className="kpi red">
    <h3>
      $
      {Math.abs(faltantes)
        .toLocaleString()}
    </h3>

    <p>Faltantes</p>
  </div>

  <div className="kpi orange">
    <h3>
      $
      {ajusteTotal.toLocaleString()}
    </h3>

    <p>Ajuste Total</p>
  </div>

</div>

{/* ================= FILTROS ================= */}

<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap"
  }}
>

  <button
    className="btn-pro btn-secondary"
    onClick={() => setFiltroTabla("todos")}
  >
    Todos
  </button>

  <button
    className="btn-pro btn-secondary"
    onClick={() => setFiltroTabla("diferencias")}
  >
    Diferencias
  </button>

  <button
    className="btn-pro btn-secondary"
    onClick={() => setFiltroTabla("sobrantes")}
  >
    Sobrantes
  </button>

  <button
    className="btn-pro btn-secondary"
    onClick={() => setFiltroTabla("faltantes")}
  >
    Faltantes
  </button>

</div>

</div>
</>

  );
}

export default KPIsResumen;