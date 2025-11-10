// services/Participante/ParticipanteService.js
import axios from "axios";

const BASE_URL = "http://localhost:3000";


const getBolillo = (accessLinkToken) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`${BASE_URL}/public/bolillo/${accessLinkToken}`)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    });
};

const updateWishlist = (accessLinkToken, wishlist) => {
    return new Promise((resolve, reject) => {
        axios
            .patch(
                `${BASE_URL}/public/bolillo/${accessLinkToken}/wishlist`,
                { wishlist }
            )
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    });
};


const viewSorteoPublic = (accessToken) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`${BASE_URL}/public/sorteos/${accessToken}`)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    });
};

const identificarParticipante = (accessToken, participanteId) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${BASE_URL}/public/sorteos/${accessToken}/identificar`, {
                participanteId
            })
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    });
};

export {
    getBolillo,
    updateWishlist,
    viewSorteoPublic,
    identificarParticipante
};
