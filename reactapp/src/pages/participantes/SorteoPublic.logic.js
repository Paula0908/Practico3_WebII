// src/pages/participantes/SorteoPublic.logic.js
import {
    viewSorteoPublic,
    identificarParticipante,
} from "../../../services/Participante/ParticipanteService";

export const cargarSorteoPublic = async (
    accessToken,
    setSorteo,
    setParticipantes,
    setError,
    setLoading
) => {
    setLoading(true);
    setError("");

    try {
        const res = await viewSorteoPublic(accessToken);
        setSorteo({
            nombre: res.nombre,
            fechaEvento: res.fechaEvento,
            isStarted: res.isStarted,
        });
        setParticipantes(res.participantesNoIdentificados || []);
    } catch (err) {
        console.error(err);
        setError(
            "No se pudo cargar el sorteo. Verifica que el enlace sea correcto."
        );
    } finally {
        setLoading(false);
    }
};

export const identificarParticipantePublic = async (
    accessToken,
    participante,
    navigate
) => {
    if (
        !window.confirm(
            `¿Confirmas que tú eres "${participante.nombreParticipante}"? Luego no podrás cambiar esta selección.`
        )
    ) {
        return;
    }

    try {
        const res = await identificarParticipante(accessToken, participante.id);
        const token = res.accessLinkToken;
        if (!token) {
            alert("No se recibió el accessLinkToken desde el servidor");
            return;
        }
        navigate(`/bolillo/${token}`);
    } catch (err) {
        console.error(err);
        alert("Error al identificar al participante");
    }
};
