
import {

  useEffect,

  useMemo,

  useState

} from "react";

function ModalAuditoriaEquipo({

  auditoria,

  onChange

}) {

/* =========================
   STATES
========================= */

const [
  serieFisica,
  setSerieFisica
] = useState("");

const [
  passwordInicio,
  setPasswordInicio
] = useState(true);

const [
  bloqueoAutomatico,
  setBloqueoAutomatico
] = useState(true);

const [
  mfaActivo,
  setMfaActivo
] = useState(true);

const [
  antivirusActivo,
  setAntivirusActivo
] = useState(true);

const [
  escritorioLimpio,
  setEscritorioLimpio
] = useState(true);

const [
  usbNoAutorizado,
  setUsbNoAutorizado
] = useState(false);

const [
  observaciones,
  setObservaciones
] = useState("");

/* =========================
   VALIDAR SERIE
========================= */

const serieCorrecta =

  serieFisica.trim()
    .toLowerCase()

  ===

  (
    auditoria.numeroSerie || ""
  )
  .trim()
  .toLowerCase();

/* =========================
   SCORE
========================= */

const score =
  useMemo(() => {

  let puntos = 0;

  /* PASSWORD */

  if (passwordInicio)
    puntos += 20;
  else
    puntos -= 20;

  /* BLOQUEO */

  if (bloqueoAutomatico)
    puntos += 15;
  else
    puntos -= 10;

  /* MFA */

  if (mfaActivo)
    puntos += 20;
  else
    puntos -= 15;

  /* ANTIVIRUS */

  if (antivirusActivo)
    puntos += 20;
  else
    puntos -= 30;

  /* CLEAN DESK */

  if (escritorioLimpio)
    puntos += 10;

  /* USB */

  if (!usbNoAutorizado)
    puntos += 10;
  else
    puntos -= 15;

  /* SERIE */

  if (serieCorrecta)
    puntos += 30;
  else
    puntos -= 40;

  /* LIMITES */

  if (puntos < 0)
    puntos = 0;

  if (puntos > 100)
    puntos = 100;

  return puntos;

}, [

  passwordInicio,

  bloqueoAutomatico,

  mfaActivo,

  antivirusActivo,

  escritorioLimpio,

  usbNoAutorizado,

  serieCorrecta

]);

/* =========================
   RESULTADO
========================= */

let estado = "RIESGO";

let color = "#ef4444";

let mensaje =
  "Equipo con múltiples riesgos de seguridad.";

if (score >= 90) {

  estado = "EXCELENTE";

  color = "#22c55e";

  mensaje =
    "Equipo completamente alineado a compliance IT.";

}

else if (score >= 70) {

  estado = "ACEPTABLE";

  color = "#f59e0b";

  mensaje =
    "Equipo funcional pero requiere mejoras.";

}
useEffect(() => {

  if (onChange) {

    onChange({

      score,

      estado,

      serieCorrecta

    });

  }

}, [

  score,

  estado,

  serieCorrecta,

  onChange

]);

/* =========================
   COMPONENTE SI/NO
========================= */

const OpcionBoolean =
({

  titulo,

  value,

  setValue

}) => (

<div>

<div
  style={{
    marginBottom: "12px",
    color: "#fff",
    fontWeight: "600"
  }}
>
  {titulo}
</div>

<div
  style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  }}
>

<button
type="button"
  className={
    value
    ? "btn-pro"
    : "btn-pro btn-secondary"
  }

  onClick={() =>
    setValue(true)
  }
>
  ✅ Sí
</button>

<button
type="button"
  className={
    !value
    ? "btn-pro"
    : "btn-pro btn-secondary"
  }

  onClick={() =>
    setValue(false)
  }
>
  ❌ No
</button>

</div>

</div>

);

/* =========================
   JSX
========================= */
if (!auditoria) return null;
return (

<div
  style={{
    width: "100%"
  }}
>

<div
  className="card-pro"

  style={{

  width: "100%",

  padding: "0px",

  background:
    "transparent",

  border: "none"
}}
>

{/* HEADER */}

<div
  style={{
    marginBottom: "30px"
  }}
>

<h1
  style={{
    color: "#fff",
    marginTop: 0,
    marginBottom: "10px"
  }}
>
  🛡 Auditoría IT Corporativa
</h1>

<p
  style={{
    color: "#94a3b8",
    marginBottom: 0
  }}
>
  {auditoria.nombreEquipo}
</p>

</div>

{/* SCORE */}

<div
  style={{

    padding: "28px",

    borderRadius: "24px",

    background:
      `${color}15`,

    border:
      `1px solid ${color}40`,

    marginBottom: "30px"
  }}
>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px"
  }}
>

<div>

<h1
  style={{
    margin: 0,
    color,
    fontSize: "58px"
  }}
>
  {score}/100
</h1>

<div
  style={{
    color,
    fontWeight: "700",
    fontSize: "22px"
  }}
>
  {estado}
</div>

</div>

<div
  style={{
    maxWidth: "420px",
    color: "#cbd5e1",
    lineHeight: "1.6"
  }}
>
  {mensaje}
</div>

</div>

</div>

{/* GRID */}

<div
  style={{

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(300px,1fr))",

    gap: "24px",

    width: "100%",

    minWidth: 0
  }}
>

{/* SEGURIDAD */}

<div
  className="card-pro"

  style={{
    padding: "26px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  🔐 Seguridad
</h2>

<div
  style={{
    display: "grid",
    gap: "22px"
  }}
>

<OpcionBoolean
  titulo="🔐 ¿Solicita contraseña al iniciar sesión?"
  value={passwordInicio}
  setValue={setPasswordInicio}
/>

<OpcionBoolean
  titulo="🔒 ¿Bloquea automáticamente?"
  value={bloqueoAutomatico}
  setValue={setBloqueoAutomatico}
/>

<OpcionBoolean
  titulo="🛡 ¿MFA habilitado?"
  value={mfaActivo}
  setValue={setMfaActivo}
/>

<OpcionBoolean
  titulo="🦠 ¿Antivirus activo?"
  value={antivirusActivo}
  setValue={setAntivirusActivo}
/>

</div>

</div>

{/* VALIDACION */}

<div
  className="card-pro"

  style={{
    padding: "26px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  🏷 Validación Inventario
</h2>

<div
  style={{
    display: "grid",
    gap: "18px"
  }}
>

<div>

<div
  style={{
    color: "#94a3b8",
    marginBottom: "8px"
  }}
>
  Serie registrada
</div>

<div
  style={{
    color: "#fff",
    fontWeight: "700",
    fontSize: "18px"
  }}
>
  {auditoria.numeroSerie}
</div>

</div>

<input
  className="input-pro"

  placeholder="Escribir serie física encontrada"

  value={serieFisica}

  onChange={(e) =>
    setSerieFisica(
      e.target.value
    )
  }
/>

<div
  style={{
    padding: "14px",
    borderRadius: "14px",

    background:

      serieFisica.length === 0

      ? "rgba(148,163,184,0.10)"

      : serieCorrecta

      ? "rgba(34,197,94,0.12)"

      : "rgba(239,68,68,0.12)",

    color:

      serieFisica.length === 0

      ? "#94a3b8"

      : serieCorrecta

      ? "#22c55e"

      : "#ef4444",

    fontWeight: "700"
  }}
>

{
  serieFisica.length === 0

  ? "Esperando validación física"

  : serieCorrecta

  ? "✅ Serie validada correctamente"

  : "🚨 Serie física NO coincide con inventario"
}

</div>

</div>

</div>

{/* COMPLIANCE */}

<div
  className="card-pro"

  style={{
    padding: "26px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  📋 Compliance / CTPAT
</h2>

<div
  style={{
    display: "grid",
    gap: "22px"
  }}
>

<OpcionBoolean
  titulo="🧹 ¿Escritorio limpio?"
  value={escritorioLimpio}
  setValue={setEscritorioLimpio}
/>

<OpcionBoolean
  titulo="🔌 ¿USB no autorizado detectado?"
  value={usbNoAutorizado}
  setValue={setUsbNoAutorizado}
/>

<textarea
  className="input-pro"

  placeholder="Observaciones generales de auditoría"

  value={observaciones}

  onChange={(e) =>
    setObservaciones(
      e.target.value
    )
  }

  style={{
    minHeight: "140px"
  }}
/>

</div>

</div>

</div>
</div>

</div>

);

}

export default ModalAuditoriaEquipo;