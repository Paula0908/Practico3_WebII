// controllers/participante.controller.js
const db = require("../models");

async function comprobarSorteoEditable(sorteoToken, userId) {
  const sorteo = await db.sorteo.findOne({
    where: { accessToken: sorteoToken, idUsuario: userId },
    attributes: ["id", "isStarted"]
  });
  if (!sorteo) return { error: { code: 404, msg: "Sorteo no encontrado" } };
  if (sorteo.isStarted) return { error: { code: 409, msg: "El sorteo ya fue iniciado" } };
  return { sorteo: sorteo };
}
async function comprobarSorteoEditablePorId(sorteoId, userId) {
  const sorteo = await db.sorteo.findOne({
    where: { id: sorteoId, idUsuario: userId },
    attributes: ["id", "isStarted"]
  });
  if (!sorteo) return { error: { code: 404, msg: "Sorteo no encontrado" } };
  if (sorteo.isStarted) return { error: { code: 409, msg: "El sorteo ya fue iniciado" } };
  return { sorteo };
}

exports.createForSorteo = async (req, res) => {
  try {
    const { sorteo, error } = await comprobarSorteoEditable(req.params.accessToken, req.user.id);
    if (error) return res.status(error.code).json({ error: error.msg });

    const participante = await db.participante.create({
      sorteoId: sorteo.id,
      nombreParticipante: req.body.nombreParticipante

    });

    return res.status(201).json({
      id: participante.id,
      sorteoId: participante.sorteoId, 
      nombreParticipante: participante.nombreParticipante,
      isIdentified: participante.isIdentified,
      wishlist: participante.wishlist ?? ''
    });
  } catch (err) {
    console.error("participantes.createForSorteo error:", err);
    return res.status(500).json({ error: "Error al crear participante" });
  }
};
exports.updateName = async (req, res) => {
  try {
    const participante = await db.participante.findByPk(req.params.id, {
      attributes: ["id", "sorteoId", "nombreParticipante"] 
    });
    if (!participante) return res.status(404).json({ error: "Participante no encontrado" });

    const { error } = await comprobarSorteoEditablePorId(participante.sorteoId, req.user.id);
    if (error) return res.status(error.code).json({ error: error.msg });

    await participante.update({ nombreParticipante: req.body.nombreParticipante });

    return res.json({
      id: participante.id,
      sorteoId: participante.sorteoId,
      nombreParticipante: participante.nombreParticipante
    });
  } catch (err) {
    console.error("participantes.updateName error:", err);
    return res.status(500).json({ error: "Error al actualizar participante" });
  }
};

exports.remove = async (req, res) => {
  try {
    const participante = await db.participante.findByPk(req.params.id, {
      attributes: ["id", "sorteoId"]
    });
    if (!participante) return res.status(404).json({ error: "Participante no encontrado" });

    const { error } = await comprobarSorteoEditablePorId(participante.sorteoId, req.user.id);
    if (error) return res.status(error.code).json({ error: error.msg });

    await db.participante.destroy({ where: { id: participante.id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("participantes.remove error:", err);
    return res.status(500).json({ error: "Error al eliminar participante" });
  }
};


