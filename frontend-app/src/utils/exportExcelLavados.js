import * as XLSX from "xlsx";

/* =========================
   EXPORTAR EXCEL
========================= */

export const exportarExcelLavados = (

  lavados,

  fechaInicio,

  fechaFin

) => {

  /* =========================
     FILTRAR FECHAS
  ========================= */
const filtrados =
  lavados.filter((l) => {

    const fechaLavado =
      new Date(l.createdAt)
      .toLocaleDateString(
        "en-CA",
        {
          timeZone:
            "America/Mexico_City"
        }
      );

    return (
      fechaLavado >= fechaInicio &&
      fechaLavado <= fechaFin
    );

  });

  /* =========================
     DATA
  ========================= */

  const data =
    filtrados.map((l) => ({

      Folio:
        l.folio,

      Fecha:
        new Date(
          l.createdAt
        ).toLocaleDateString(
          "es-MX",
          {
            timeZone:
              "America/Mexico_City"
          }
        ),

      Unidad:
        l.numeroUnidad,

      TipoUnidad:
        l.tipoUnidad,

      Operadores:
        l.operadores?.join(", "),

      CantidadOperadores:
        l.cantidadOperadores,

      TiposLavado:
        l.tiposLavado?.join(", "),
CostoTotal:
  l.costoTotal || 0,

      Estatus:
        l.estatus,

      CreadoPor:
        l.creadoPor || "",

      Supervisor:
        l.aprobadoPor || "",

      ComentarioSupervisor:
        l.comentarioSupervisor || ""

    }));

  /* =========================
     SHEET
  ========================= */

  const worksheet =
    XLSX.utils.json_to_sheet(
      data
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(

    workbook,

    worksheet,

    "Lavados"

  );

  /* =========================
     SAVE
  ========================= */

  XLSX.writeFile(

    workbook,

    `Lavados_${fechaInicio}_${fechaFin}.xlsx`

  );

};