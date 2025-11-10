// services/Usuario/ParticipanteService.js
import axios from "axios";
import { getAccessToken } from "../../utils/TokenUtilities";

const BASE_URL = "http://localhost:3000";

const authHeader = () => ({
    Authorization: `Bearer ${getAccessToken()}`
});

const getParticipantes = (accessToken) => {
    return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/sorteos/${accessToken}/participantes`, { headers: authHeader() })
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
};

const addParticipante = (accessToken, nombreParticipante) => {
    return new Promise((resolve, reject) => {
        axios.post(
            `${BASE_URL}/sorteos/${accessToken}/participantes`,
            { nombreParticipante },
            { headers: authHeader() }
        )
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
};

const updateParticipante = (id, nombreParticipante) => {
    return new Promise((resolve, reject) => {
        axios.put(
            `${BASE_URL}/sorteos/participantes/${id}`,
            { nombreParticipante },
            { headers: authHeader() }
        )
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
};

const deleteParticipante = (id) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(`${BASE_URL}/sorteos/participantes/${id}`, {
                headers: authHeader()
            })
            .then(() => resolve())
            .catch((err) => reject(err));
    });
};
export {
    getParticipantes,
    addParticipante,
    updateParticipante,
    deleteParticipante
};
