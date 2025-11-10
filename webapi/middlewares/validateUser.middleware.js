const db = require("../models/");

async function validateUser(req, res, next) {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!bearerToken.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = bearerToken.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const userToken = await db.authToken.findOne({ where: { token } });
    if (!userToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await db.usuario.findByPk(userToken.idUsuario);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
}
async function validateParticipantLink(req, res, next) {
    try {
        let { token } = req.params;
        if (!token) return res.status(404).json({ error: 'Link inválido' });
        token = token.toLowerCase();

        const participante = await db.participante.findOne({ where: { accessLinkToken: token } });
        if (!participante) return res.status(404).json({ error: 'Link inválido' });

        req.participante = participante;
        next();
    } catch (err) {
        console.error('validateParticipantLink error:', err);
        res.status(500).json({ error: 'Internal error' });
    }
}


module.exports = { validateUser, validateParticipantLink };