import {
  useState,
  useRef
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  agregarCapturaService,
  actualizarCapturaService
} from "../services/ciclicosService";

const API =
  "https://ticket-pro-backend.onrender.com";

export default function useCapturaCiclico({

  ciclicoActivo,

  cargarCapturas,
  cargarCiclicos

}) {

  const [sku, setSku] =
    useState("");

  const [item, setItem] =
    useState(null);

  const [conteo, setConteo] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const [resultados, setResultados] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    duplicadoModal,
    setDuplicadoModal
  ] = useState(false);

  const [
    duplicadoData,
    setDuplicadoData
  ] = useState(null);

  const [
    editarModal,
    setEditarModal
  ] = useState(false);

  const [
    editarItem,
    setEditarItem
  ] = useState(null);

  const [
    nuevoConteoEdit,
    setNuevoConteoEdit
  ] = useState("");

  const busquedaRef =
    useRef("");

  const conteoInputRef =
    useRef(null);

  const skuInputRef =
    useRef(null);

  // ================= BUSCAR SKU =================

  const buscarParaCiclico =
    async () => {

      if (!sku) return;

      const codigo =
        String(sku).trim();

      try {

        const inv =
          await axios.get(
            API +
            "/inventario/" +
            codigo
          );

        const cat =
          await axios.get(
            API +
            "/catalogo/" +
            codigo
          );

        if (
          !inv.data &&
          !cat.data
        ) {

          toast.error(
            "SKU no existe"
          );

          setSku("");

          skuInputRef.current?.focus();

          return;
        }

        setItem({

          sku: codigo,

          articulo:

            inv.data?.articulo ||

            cat.data?.articulo ||

            "Sin descripción",

          existencia:
            inv.data?.existencia || 0,

          costo:
            inv.data?.costo || 0,

          ubicacion:
            cat.data?.ubicacion || "N/A"
        });

        setTimeout(() => {

          conteoInputRef.current?.focus();

        }, 100);

      } catch (err) {

        console.log(err);

        toast.error(
          "Error conexión"
        );
      }
    };

  // ================= BUSQUEDA =================

  const buscarDescripcion =
    async (texto) => {

      setBusqueda(texto);

      busquedaRef.current = texto;

      if (
        texto.trim().length < 2
      ) {

        setResultados([]);

        return;
      }

      try {

        const res =
          await axios.get(
            API +
            "/buscar?q=" +
            texto
          );

        if (
          busquedaRef.current !== texto
        ) {
          return;
        }

        setResultados(res.data);

      } catch (err) {

        console.log(err);
      }
    };

  // ================= AGREGAR =================

  const agregar =
    async () => {

      setLoading(true);

      if (!item) {

        setLoading(false);

        return;
      }

      const conteoFinal =

        conteo === ""
          ? 0
          : Number(conteo);

      try {

        const nuevo = {

          sku: item.sku,

          articulo:
            item.articulo,

          sistema:
            item.existencia || 0,

          conteo:
            conteoFinal,

          diferencia:

            conteoFinal -

            Number(
              item.existencia || 0
            ),

          ubicacion:
            item.ubicacion || "-",

          costo:
            item.costo || 0,

          ajuste:

            (
              conteoFinal -

              Number(
                item.existencia || 0
              )
            )

            *

            Number(
              item.costo || 0
            )
        };

        await agregarCapturaService(
          ciclicoActivo._id,
          nuevo
        );

        await cargarCapturas(
          ciclicoActivo._id
        );

        await cargarCiclicos();

        setSku("");

        setItem(null);

        setConteo("");

        setDuplicadoModal(false);

        setDuplicadoData(null);

        skuInputRef.current?.focus();

      } catch (err) {

        console.log(err);

        if (
          err.response?.status === 409
        ) {

          const existente =
            err.response.data.captura;

          setDuplicadoData({

            existente,

            conteoNuevo:
              conteoFinal
          });

          setDuplicadoModal(true);

          return;
        }

        toast.error(
          "Error agregando"
        );

      } finally {

        setLoading(false);
      }
    };

  // ================= DUPLICADO =================

  const manejarDuplicado =
    async (tipo) => {

      setLoading(true);

      try {

        const existente =
          duplicadoData.existente;

        let nuevoConteo =
          existente.conteo;

        if (tipo === "sumar") {

          nuevoConteo =

            Number(
              existente.conteo || 0
            )

            +

            Number(
              duplicadoData.conteoNuevo || 0
            );
        }

        if (
          tipo === "reemplazar"
        ) {

          nuevoConteo = Number(
            duplicadoData.conteoNuevo || 0
          );
        }

        await actualizarCapturaService(
          existente._id,
          {
            conteo: nuevoConteo
          }
        );

        toast.success(
          "SKU actualizado 🔥"
        );

        await cargarCapturas(
          ciclicoActivo._id
        );

        await cargarCiclicos();

        setSku("");

        setItem(null);

        setConteo("");

        setDuplicadoModal(false);

        setDuplicadoData(null);

        skuInputRef.current?.focus();

      } catch (err) {

        console.log(err);

        toast.error(
          "Error actualizando"
        );

      } finally {

        setLoading(false);
      }
    };

  // ================= EDITAR =================

  const guardarEdicion =
    async () => {

      try {

        await actualizarCapturaService(
          editarItem._id,
          {
            conteo: Number(
              nuevoConteoEdit || 0
            )
          }
        );

        toast.success(
          "Actualizado 🔥"
        );

        await cargarCapturas(
          ciclicoActivo._id
        );

        await cargarCiclicos();

        setEditarModal(false);

        setEditarItem(null);

        setNuevoConteoEdit("");

        skuInputRef.current?.focus();

      } catch (err) {

        console.log(err);

        toast.error(
          "Error actualizando"
        );
      }
    };

  return {

    sku,
    setSku,

    item,
    setItem,

    conteo,
    setConteo,

    busqueda,
    setBusqueda,

    resultados,
    setResultados,

    loading,

    duplicadoModal,
    setDuplicadoModal,

    duplicadoData,
    setDuplicadoData,

    editarModal,
    setEditarModal,

    editarItem,
    setEditarItem,

    nuevoConteoEdit,
    setNuevoConteoEdit,

    buscarParaCiclico,
    buscarDescripcion,

    agregar,

    manejarDuplicado,

    guardarEdicion,

    conteoInputRef,
    skuInputRef
  };
}