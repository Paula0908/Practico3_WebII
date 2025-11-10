// src/pages/sorteos/DetalleSorteo.logic.js
import {
    getSorteoByToken,
    updateSorteo,
    sortear,
    deleteSorteo
} from "../../../services/Usuario/SorteoService";

export const cargarSorteo = async (accessToken, navigate, setSorteo, setNombre, setFechaEvento) => {
    try {
        const data = await getSorteoByToken(accessToken);

        setSorteo(data);
        setNombre(data.nombre || "");

        const fecha = data.fechaEvento ? new Date(data.fechaEvento) : null;
        if (fecha) {
            const yyyy = fecha.getFullYear();
            const mm = String(fecha.getMonth() + 1).padStart(2, "0");
            const dd = String(fecha.getDate()).padStart(2, "0");
            setFechaEvento(`${yyyy}-${mm}-${dd}`);
        } else {
            setFechaEvento("");
        }
    } catch (err) {
        console.error(err);
        alert("Error al cargar el sorteo");
        navigate("/sorteos");
    }
};

export const guardarCambiosSorteo = async (accessToken, { nombre, fechaEvento }, setSorteo, setShowEdit) => {
    try {
        const data = await updateSorteo(accessToken, { nombre, fechaEvento });
        setSorteo(data);
        alert("Sorteo actualizado");
        setShowEdit(false);
    } catch (err) {
        console.error(err);
        alert("Error al actualizar sorteo");
    }
};

export const ejecutarSorteo = async (accessToken, recargarFn) => {
    if (!window.confirm("¿Sortear ahora? Luego no podrás editar el sorteo ni los participantes.")) return;
    try {
        await sortear(accessToken);
        alert("Sorteo realizado");
        recargarFn();
    } catch (err) {
        console.error(err);
        alert("Error al realizar el sorteo");
    }
};

export const eliminarSorteo = async (accessToken, navigate) => {
    if (!window.confirm("¿Eliminar este sorteo? Esta acción no se puede deshacer.")) return;
    try {
        await deleteSorteo(accessToken);
        navigate("/sorteos");
    } catch (err) {
        console.error(err);
        alert("Error al eliminar sorteo");
    }
};
