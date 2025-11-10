// src/pages/tokens/AccesoTokensPage.logic.js

export const irAlSorteoConToken = (rawToken, setErrorSorteo, navigate) => {
    setErrorSorteo("");

    const token = (rawToken || "").trim();
    if (!token) {
        setErrorSorteo("Introduce el token del sorteo");
        return;
    }

    navigate(`/sorteo/${token}`);
};

export const irAlBolilloConToken = (rawToken, setErrorBolillo, navigate) => {
    setErrorBolillo("");

    const token = (rawToken || "").trim();
    if (!token) {
        setErrorBolillo("Introduce el token de participante (bolillo :3)");
        return;
    }

    navigate(`/bolillo/${token}`);
};
