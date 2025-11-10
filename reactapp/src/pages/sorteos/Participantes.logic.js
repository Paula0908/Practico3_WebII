import {
    getParticipantes, addParticipante, updateParticipante, deleteParticipante
} from "../../../services/Usuario/ParticipanteServices";

export const cargarParticipantes = async (accessToken, setParticipantes) => {
    try {
        const data = await getParticipantes(accessToken);
        setParticipantes(data);
    } catch (err) {
        console.error(err);
        alert("Error al cargar participantes");
    }
};

export const agregarParticipante = async (
    accessToken,
    nombreParticipante,
    afterSuccess
) => {
    try {
        await addParticipante(accessToken, nombreParticipante);
        afterSuccess && afterSuccess();
    } catch (err) {
        console.error(err);
        alert("Error al agregar participante");
    }
};

export const editarParticipante = async (
    participanteId,
    nombreNuevo,
    afterSuccess
) => {
    try {
        await updateParticipante(participanteId, nombreNuevo);
        afterSuccess && afterSuccess();
    } catch (err) {
        console.error(err);
        alert("Error al actualizar participante");
    }
};

export const eliminarParticipante = async (
    participanteId,
    afterSuccess
) => {
    if (!window.confirm("¿Eliminar este participante?")) return;

    try {
        await deleteParticipante(participanteId);
        afterSuccess && afterSuccess();
    } catch (err) {
        console.error(err);
        alert("Error al eliminar participante");
    }
};
