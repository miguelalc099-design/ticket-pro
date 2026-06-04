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

      const fecha =
        new Date(l.createdAt);

      const inicio =
        new Date(fechaInicio);

      const fin =
        new Date(fechaFin);

      fin.setHours(
        23,
        59,
        59,
        999
      );

      return (
        fecha >= inicio &&
        fecha <= fin
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