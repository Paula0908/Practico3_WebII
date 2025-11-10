// src/services/AuthService.js
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const login = (loginData) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${BASE_URL}/auth/login`, loginData)
            .then((response) => {
                resolve(response.data); 
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
};

const register = (registerData) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${BASE_URL}/auth/register`, registerData)
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
};

export { login, register };
