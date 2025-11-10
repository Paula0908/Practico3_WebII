// src/pages/usuarios/ListaSorteos.logic.js
import { getAllSorteos } from "../../../services/Usuario/SorteoService";

export const cargarListaSorteos = (setListaSorteos) => {
    getAllSorteos()
        .then((sorteos) => {
            setListaSorteos(sorteos);
        })
        .catch(() => {
            alert("Error al cargar los sorteos");
            setListaSorteos([]);
        });
};
