// src/pages/participantes/Bolillo.logic.js
import {
    getBolillo, updateWishlist,
} from "../../../services/Participante/ParticipanteService";

export const cargarBolillo = async (
    accessLinkToken,
    setSorteo,
    setYo,
    setAsignado,
    setWishlist,
    setError,
    setLoading
) => {
    setLoading(true);
    setError("");

    try {
        const res = await getBolillo(accessLinkToken);
        setSorteo(res.sorteo || null);
        setYo(res.yo || null);
        setAsignado(res.asignado || null);
        setWishlist(res.yo?.wishlist ?? "");
    } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del bolillo.");
    } finally {
        setLoading(false);
    }
};


export const guardarWishlist = async (
    accessLinkToken,
    wishlist,
    setSaving,
    onSuccess
) => {
    setSaving(true);
    try {
        await updateWishlist(accessLinkToken, wishlist);
        if (onSuccess) onSuccess();
    } catch (err) {
        console.error(err);
        alert("Error al guardar la wishlist");
    } finally {
        setSaving(false);
    }
};
