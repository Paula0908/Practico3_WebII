const db = require("../models/");
const bcrypt = require('bcryptjs');
const { generateToken } = require("../utilities/text.utilities");

exports.login = async (req, res) => {

    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    try {
        const usuario = await db.usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }
        const passwordMatch = await bcrypt.compare(password, usuario.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }
        const authToken = generateToken();
        const nuevoToken = await db.authToken.create({
            token: authToken,
            idUsuario: usuario.id
        });
        res.json({ token: nuevoToken.token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}
exports.register = async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const nombreCompleto = String(req.body.nombreCompleto || '').trim();
    try {
        const existingUser = await db.usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = await db.usuario.create({
            email,
            password: hashedPassword,
            nombreCompleto
        });
        res.status(201).json(
            {
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                nombreCompleto: nuevoUsuario.nombreCompleto
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}