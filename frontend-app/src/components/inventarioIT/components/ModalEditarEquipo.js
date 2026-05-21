import { useState } from "react";

import { toast }
from "react-toastify";

function ModalEditarEquipo({

  equipo,

  onClose,

  recargarEquipos

}) {

const API =
  "https://ticket-pro-backend.onrender.com";

if (!equipo) return null;

/* =========================
   STATES GENERALES
========================= */

const [nombreEquipo,
  setNombreEquipo] =
  useState(
    equipo?.nombreEquipo || ""
  );

const [usuarioAsignado,
  setUsuarioAsignado] =
  useState(
    equipo?.usuarioAsignado || ""
  );

const [tipoEquipo,
  setTipoEquipo] =
  useState(
    equipo?.tipoEquipo || "laptop"
  );

const [windows,
  setWindows] =
  useState(
    equipo?.windows || ""
  );

const [antivirus,
  setAntivirus] =
  useState(
    equipo?.antivirus || ""
  );

const [mfa,
  setMfa] =
  useState(
    equipo?.mfa ?? true
  );

/* =========================
   HARDWARE ENTERPRISE
========================= */

const [numeroSerie,
  setNumeroSerie] =
  useState(
    equipo?.numeroSerie || ""
  );

const [marca,
  setMarca] =
  useState(
    equipo?.marca || ""
  );

const [modelo,
  setModelo] =
  useState(
    equipo?.modelo || ""
  );

const [procesador,
  setProcesador] =
  useState(
    equipo?.procesador || ""
  );

const [ram,
  setRam] =
  useState(
    equipo?.ram || ""
  );

const [tarjetaGrafica,
  setTarjetaGrafica] =
  useState(
    equipo?.tarjetaGrafica || ""
  );

const [almacenamiento,
  setAlmacenamiento] =
  useState(
    equipo?.almacenamiento || ""
  );

const [tipoSistema,
  setTipoSistema] =
  useState(
    equipo?.tipoSistema || ""
  );

const [idDispositivo,
  setIdDispositivo] =
  useState(
    equipo?.idDispositivo || ""
  );

const [idProducto,
  setIdProducto] =
  useState(
    equipo?.idProducto || ""
  );

const [fechaCompra,
  setFechaCompra] =
  useState(
    equipo?.fechaCompra
    ? equipo.fechaCompra
        .split("T")[0]
    : ""
  );

const [garantiaHasta,
  setGarantiaHasta] =
  useState(
    equipo?.garantiaHasta
    ? equipo.garantiaHasta
        .split("T")[0]
    : ""
  );

const [proveedor,
  setProveedor] =
  useState(
    equipo?.proveedor || ""
  );

const [factura,
  setFactura] =
  useState(
    equipo?.factura || ""
  );

const [numeroActivo,
  setNumeroActivo] =
  useState(
    equipo?.numeroActivo || ""
  );

/* =========================
   PASSWORD WINDOWS
========================= */

const [passwordWindows,
  setPasswordWindows] =
  useState("");

const [
  confirmarPasswordWindows,

  setConfirmarPasswordWindows
] = useState("");

const [
  passwordWindowsDesconocido,

  setPasswordWindowsDesconocido
] = useState(
  equipo?.passwordWindowsDesconocido || false
);

const [
  fechaCambioPasswordWindows,

  setFechaCambioPasswordWindows
] = useState(
  equipo?.fechaCambioPasswordWindows
  ? equipo.fechaCambioPasswordWindows
      .split("T")[0]
  : ""
);

const [
  fechaExpiracionPasswordWindows,

  setFechaExpiracionPasswordWindows
] = useState(
  equipo?.fechaExpiracionPasswordWindows
  ? equipo.fechaExpiracionPasswordWindows
      .split("T")[0]
  : ""
);

/* =========================
   PASSWORD ERP
========================= */

const [passwordERP,
  setPasswordERP] =
  useState("");

const [
  confirmarPasswordERP,

  setConfirmarPasswordERP
] = useState("");

const [
  passwordERPNoAplica,

  setPasswordERPNoAplica
] = useState(
  equipo?.passwordERPNoAplica || false
);

const [
  fechaCambioPasswordERP,

  setFechaCambioPasswordERP
] = useState(
  equipo?.fechaCambioPasswordERP
  ? equipo.fechaCambioPasswordERP
      .split("T")[0]
  : ""
);

const [
  fechaExpiracionPasswordERP,

  setFechaExpiracionPasswordERP
] = useState(
  equipo?.fechaExpiracionPasswordERP
  ? equipo.fechaExpiracionPasswordERP
      .split("T")[0]
  : ""
);

/* =========================
   ANTIVIRUS
========================= */

const [
  fechaExpiracionAntivirus,

  setFechaExpiracionAntivirus
] = useState(
  equipo?.fechaExpiracionAntivirus
  ? equipo.fechaExpiracionAntivirus
      .split("T")[0]
  : ""
);

/* =========================
   VALIDACIONES
========================= */

const windowsCoincide =

  passwordWindows ===
  confirmarPasswordWindows;

const erpCoincide =

  passwordERP ===
  confirmarPasswordERP;

/* =========================
   GUARDAR
========================= */

const guardarCambios =
  async () => {

  try {

    if (
      !passwordWindowsDesconocido &&
      passwordWindows &&
      !windowsCoincide
    ) {

      toast.error(
        "Passwords Windows no coinciden"
      );

      return;
    }

    if (
      !passwordERPNoAplica &&
      passwordERP &&
      !erpCoincide
    ) {

      toast.error(
        "Passwords ERP no coinciden"
      );

      return;
    }

    const body = {

      nombreEquipo,
      usuarioAsignado,
      tipoEquipo,
      windows,
      antivirus,
      mfa,

      numeroSerie,
      marca,
      modelo,
      procesador,
      ram,
      tarjetaGrafica,
      almacenamiento,
      tipoSistema,
      idDispositivo,
      idProducto,
      fechaCompra,
      garantiaHasta,
      proveedor,
      factura,
      numeroActivo,

      passwordWindows:
        passwordWindows ||
        equipo.passwordWindows,

      passwordWindowsDesconocido,

      fechaCambioPasswordWindows,

      fechaExpiracionPasswordWindows,

      passwordERP:
        passwordERP ||
        equipo.passwordERP,

      passwordERPNoAplica,

      fechaCambioPasswordERP,

      fechaExpiracionPasswordERP,

      fechaExpiracionAntivirus

    };

    const res = await fetch(

      `${API}/it/equipos/${equipo._id}`,

      {

        method: "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(body)
      }
    );

    if (!res.ok) {

      throw new Error(
        "Error actualizando"
      );
    }

    toast.success(
      "Equipo actualizado"
    );

    recargarEquipos();

    onClose();

  } catch (err) {

    console.log(err);

    toast.error(
      "Error actualizando equipo"
    );
  }
};

return (

<div
  style={{

    position: "fixed",

    inset: 0,

    background:
      "rgba(2,6,23,0.82)",

    backdropFilter: "blur(8px)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 9999,

    padding: "20px",

    overflowY: "auto"
  }}
>

<div
  className="card-pro"

  style={{

    width: "100%",

    maxWidth: "950px",

    maxHeight: "95vh",

    overflowY: "auto",

    padding: "32px",

    position: "relative",

    background:
      "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.88))",

    border:
      "1px solid rgba(51,65,85,0.8)"
  }}
>

<button

  onClick={onClose}

  style={{

    position: "absolute",

    right: "20px",

    top: "20px",

    width: "42px",

    height: "42px",

    borderRadius: "12px",

    border: "none",

    background:
      "rgba(239,68,68,0.15)",

    color: "#ef4444",

    cursor: "pointer",

    fontSize: "18px"
  }}
>
  ✕
</button>

<h1
  style={{
    color: "#fff",
    marginTop: 0,
    marginBottom: "30px"
  }}
>
  ✏ Editar Equipo
</h1>

<div
  style={{
    display: "grid",
    gap: "24px"
  }}
>

{/* DATOS GENERALES */}

<div
  className="card-pro"
  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  💻 Datos Generales
</h2>

<div
  style={{
    display: "grid",
    gap: "18px"
  }}
>

<input
  className="input-pro"
  placeholder="Nombre Equipo"
  value={nombreEquipo}
  onChange={(e) =>
    setNombreEquipo(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Usuario Asignado"
  value={usuarioAsignado}
  onChange={(e) =>
    setUsuarioAsignado(
      e.target.value
    )
  }
/>

<select
  className="input-pro"
  value={tipoEquipo}
  onChange={(e) =>
    setTipoEquipo(
      e.target.value
    )
  }
>

<option value="laptop">
  💻 Laptop
</option>

<option value="desktop">
  🖥 Desktop
</option>

</select>

<select
  className="input-pro"
  value={windows}
  onChange={(e) =>
    setWindows(
      e.target.value
    )
  }
>

<option>
  Windows 11 Pro
</option>

<option>
  Windows 10 Pro
</option>

<option>
  Windows 11 Home
</option>

<option>
  Windows 10 Home
</option>

<option>
  Windows Server 2022
</option>

<option>
  Windows Server 2019
</option>

<option>
  macOS
</option>

<option>
  Linux Ubuntu
</option>

</select>

</div>

</div>

{/* HARDWARE */}

<div
  className="card-pro"
  style={{
    padding: "24px"
  }}
>

<h2
  style={{
    color: "#fff",
    marginTop: 0
  }}
>
  🖥 Hardware Enterprise
</h2>

<div
  style={{
    display: "grid",
    gap: "18px"
  }}
>

<input
  className="input-pro"
  placeholder="Número de serie"
  value={numeroSerie}
  onChange={(e) =>
    setNumeroSerie(
      e.target.value
    )
  }
/>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "16px"
  }}
>

<input
  className="input-pro"
  placeholder="Marca"
  value={marca}
  onChange={(e) =>
    setMarca(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Modelo"
  value={modelo}
  onChange={(e) =>
    setModelo(
      e.target.value
    )
  }
/>

</div>

<input
  className="input-pro"
  placeholder="Procesador"
  value={procesador}
  onChange={(e) =>
    setProcesador(
      e.target.value
    )
  }
/>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "16px"
  }}
>

<input
  className="input-pro"
  placeholder="RAM"
  value={ram}
  onChange={(e) =>
    setRam(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Tarjeta gráfica"
  value={tarjetaGrafica}
  onChange={(e) =>
    setTarjetaGrafica(
      e.target.value
    )
  }
/>

</div>

<input
  className="input-pro"
  placeholder="Almacenamiento"
  value={almacenamiento}
  onChange={(e) =>
    setAlmacenamiento(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="Tipo sistema"
  value={tipoSistema}
  onChange={(e) =>
    setTipoSistema(
      e.target.value
    )
  }
/>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "16px"
  }}
>

<input
  className="input-pro"
  placeholder="ID dispositivo"
  value={idDispositivo}
  onChange={(e) =>
    setIdDispositivo(
      e.target.value
    )
  }
/>

<input
  className="input-pro"
  placeholder="ID producto"
  value={idProducto}
  onChange={(e) =>
    setIdProducto(
      e.target.value
    )
  }
/>

</div>

</div>

</div>

<button
  className="btn-pro"
  onClick={guardarCambios}
>
  💾 Guardar Cambios
</button>

</div>

</div>

</div>

);

}

export default ModalEditarEquipo;