// src/pages/usuarios/HomeUsuario.logic.js
import { getAllSorteos, createSorteo } from "../../../services/Usuario/SorteoService";

export const cargarSorteos = (setSorteos) => {
    getAllSorteos()
        .then((data) => {
            setSorteos(data);
        })
        .catch((error) => {
            console.error(error);
            alert("Error al cargar sorteos");
            setSorteos([]);
        });
};

export const crearSorteoLogica = (payload, onSuccess) => {
    createSorteo(payload)
        .then(() => {
            if (onSuccess) onSuccess();
        })
        .catch((error) => {
            console.error(error);
            alert("Error al crear el sorteo");
        });
};
