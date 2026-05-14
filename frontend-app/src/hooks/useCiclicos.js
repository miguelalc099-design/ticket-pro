import {
  useState,
  useEffect
} from "react";

import toast from "react-hot-toast";

import {
  obtenerCiclicos,
  obtenerCapturas,
  cerrarCiclicoService
} from "../services/ciclicosService";

export default function useCiclicos() {

  const [modo, setModo] =
    useState("lista");

  const [captura, setCaptura] =
    useState([]);

  const [ciclicos, setCiclicos] =
    useState([]);

  const [
    ciclicoActivo,
    setCiclicoActivo
  ] = useState(null);

  // ================= CARGAR =================

  const cargarCiclicos =
    async () => {

      try {

        const data =
          await obtenerCiclicos();

        setCiclicos(data || []);

      } catch (err) {

        console.log(err);
      }
    };

  const cargarCapturas =
    async (id) => {

      try {

        const data =
          await obtenerCapturas(id);

        setCaptura(data || []);

      } catch (err) {

        console.log(err);
      }
    };

  // ================= INIT =================

  useEffect(() => {

    cargarCiclicos();

  }, []);

  // ================= ABRIR =================

  const abrirCiclico =
    async (c) => {

      setCiclicoActivo(c);

      await cargarCapturas(c._id);

      setModo("captura");
    };

  // ================= CERRAR =================

  const cerrarCiclico =
    async () => {

      if (!ciclicoActivo) return;

      try {

        await cerrarCiclicoService(
          ciclicoActivo._id
        );

        toast.success(
          "Cíclico cerrado"
        );

        await cargarCiclicos();

        setModo("lista");

        setCaptura([]);

        setCiclicoActivo(null);

      } catch (err) {

        console.log(err);
      }
    };

  return {

    // ESTADOS
    modo,
    setModo,

    captura,
    setCaptura,

    ciclicos,
    setCiclicos,

    ciclicoActivo,
    setCiclicoActivo,

    // FUNCIONES
    cargarCiclicos,
    cargarCapturas,

    abrirCiclico,
    cerrarCiclico
  };
}