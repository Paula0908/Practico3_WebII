// services/Usuario/SorteoService.js
import axios from "axios";
import { getAccessToken } from "../../utils/TokenUtilities";

const BASE_URL = "http://localhost:3000";

const authHeader = () => ({
    Authorization: `Bearer ${getAccessToken()}`
});


const getAllSorteos = () => {
    return new Promise((resolve, reject) => {
        axios
            .get(`${BASE_URL}/sorteos`, { headers: authHeader() })
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
};

const getSorteoByToken = (accessToken) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`${BASE_URL}/sorteos/${accessToken}`, { headers: authHeader() })
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
};

const createSorteo = (sorteoData) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${BASE_URL}/sorteos`, sorteoData, { headers: authHeader() })
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
};

const updateSorteo = (accessToken, sorteoData) => {
    return new Promise((resolve, reject) => {
        axios
            .put(`${BASE_URL}/sorteos/${accessToken}`, sorteoData, { headers: authHeader() })
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
};

const deleteSorteo = (accessToken) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(`${BASE_URL}/sorteos/${accessToken}`, { headers: authHeader() })
            .then(() => resolve())
            .catch(err => reject(err));
    });
};

const sortear = (accessToken) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${BASE_URL}/sorteos/${accessToken}/sortear`, {}, { headers: authHeader() })
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
};

export {
    getAllSorteos,
    getSorteoByToken,
    createSorteo,
    updateSorteo,
    deleteSorteo,
    sortear
};
