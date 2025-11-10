// controllers/sorteo.controller.js
const db = require("../models");
const process = require("process");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function comprobarSorteoPropio(sorteoToken, userId) {
  const sorteo = await db.sorteo.findOne({
    where: { accessToken: sorteoToken, idUsuario: userId },
    attributes: ["id", "nombre", "fechaEvento", "isStarted", "accessToken"]
  });
  if (!sorteo) return { error: { code: 404, msg: "Sorteo no encontrado" } };
  return { sorteo };
}

async function comprobarSorteoEditable(sorteoToken, userId) {
  const res = await comprobarSorteoPropio(sorteoToken, userId);
  if (res.error) return res;
  if (res.sorteo.isStarted) return { error: { code: 409, msg: "El sorteo ya fue iniciado y no se puede editar" } };
  return res;
}

// GET /sorteos  
exports.getAll = async (req, res) => {
  try {
    const sorteos = await db.sorteo.findAll({
      where: { idUsuario: req.user.id },
      attributes: ["id", "nombre", "fechaEvento", "isStarted", "accessToken"], //todo: revisar si poner token o no en el get all
      order: [["fechaEvento", "DESC"]],
    });
    return res.json(sorteos);
  } catch (err) {
    console.error("sorteos.getAll error:", err);
    return res.status(500).json({ error: "Error al listar los sorteos" });
  }
};

// GET /sorteos/:accessToken 
exports.getByToken = async (req, res) => {
  try {
    const { sorteo, error } = await comprobarSorteoPropio(req.params.accessToken, req.user.id);
    if (error) return res.status(error.code).json({ error: error.msg });

    const s = await db.sorteo.findOne({
      where: { accessToken: sorteo.accessToken },
      attributes: ["id", "nombre", "fechaEvento", "isStarted", "accessToken"],
      include: [{
        model: db.participante,
        as: "participantes",
        attributes: ["id", "nombreParticipante", "isIdentified", "wishlist"]
      }]
    });

    return res.json({
      id: s.id,
      nombre: s.nombre,
      fechaEvento: s.fechaEvento,
      isStarted: s.isStarted,
      publicUrl: `${BASE_URL}/sorteos/${s.accessToken}`,
      participantes: s.participantes
    });
  } catch (err) {
    console.error("sorteos.getById error:", err);
    return res.status(500).json({ error: "Error al obtener el sorteo" });
  }
};


// GET /sorteos/:accessToken/participantes 
exports.getParticipantes = async (req, res) => {
  try {
    const { sorteo, error } = await comprobarSorteoPropio(req.params.accessToken, req.user.id);
    if (error) return res.status(error.code).json({ error: error.msg });

    const participantes = await db.participante.findAll({
      where: { sorteoId: sorteo.id },
      attributes: ["id", "nombreParticipante", "accessLinkToken", "isIdentified", "wishlist"]
    });

    res.json(participantes);
  } catch (err) {
    console.error("sorteos.getParticipantes error:", err);
    return res.status(500).json({ error: "Error al listar participantes" });
  }
};

// POST /sorteos 
exports.create = async (req, res) => {
  try {
    const sorteo = await db.sorteo.create({
      nombre: req.body.nombre,
      fechaEvento: req.body.fechaEvento,
      isStarted: false,
      idUsuario: req.user.id
    });
    const json = sorteo.toJSON();
    res.status(201).json({
      id: json.id,
      nombre: json.nombre,
      fechaEvento: json.fechaEvento,
      isStarted: json.isStarted,
      publicUrl: `${BASE_URL}/sorteos/${json.accessToken}`,
    });
  } catch (err) {
    console.error("sorteos.create error:", err);
    res.status(500).json({ error: "Error al crear el sorteo" });
  }
};

// PUT /sorteos/:accessToken 
exports.update = async (req, res) => {
  try {
    const { sorteo, error } = await comprobarSorteoEditable(req.params.accessToken, req.user.id);
    if (error) return res.status(error.code).json({ error: error.msg });

    const updates = {};
    if (req.body.nombre !== undefined) updates.nombre = req.body.nombre;
    if (req.body.fechaEvento !== undefined) updates.fechaEvento = req.body.fechaEvento;

    await sorteo.update(updates);

    return res.json({
      id: sorteo.id,
      nombre: sorteo.nombre,
      fechaEvento: sorteo.fechaEvento,
      isStarted: sorteo.isStarted,
      publicUrl: `${BASE_URL}/sorteos/${sorteo.accessToken}`,
    });
  } catch (err) {
    console.error("sorteos.update error:", err);
    return res.status(500).json({ error: "Error al actualizar el sorteo" });
  }
};

// DELETE /sorteos/:accessToken
exports.remove = async (req, res) => {
  try {
    const { sorteo, error } = await comprobarSorteoEditable(req.params.accessToken, req.user.id);
    if (error) return res.status(error.code).json({ error: error.msg });

    await db.sorteo.destroy({ where: { accessToken: sorteo.accessToken } });
    res.json({ ok: true });
  } catch (err) {
    console.error("sorteos.remove error:", err);
    res.status(500).json({ error: "Error al eliminar el sorteo" });
  }
};

exports.sortear = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {

    const { sorteo, error } = await comprobarSorteoEditable(req.params.accessToken, req.user.id);
    if (error) {
      await t.rollback();
      return res.status(error.code).json({ error: error.msg });
    }
    const participantes = await db.participante.findAll({
      where: { sorteoId: sorteo.id },
      attributes: ["id"],
      order: [["id", "ASC"]],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    const n = participantes.length;
    if (n < 3) {
      await t.rollback();
      return res.status(400).json({ error: "Se requieren al menos 3 participantes" });
    }

    const orden = participantes.map(p => p.id);

    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [orden[i], orden[j]] = [orden[j], orden[i]];
    }

    const updates = orden.map((id, i) => ({
      id,
      assignedToId: orden[(i + 1) % n]
    }));

    await Promise.all(
      updates.map(u =>
        db.participante.update(
          { assignedToId: u.assignedToId },
          { where: { id: u.id }, transaction: t }
        )
      )
    );

    await sorteo.update({ isStarted: true }, { transaction: t });

    await t.commit();
    return res.json({ ok: true, total: n });
  } catch (err) {
    await t.rollback();
    console.error("sorteos.sortear error:", err);
    return res.status(500).json({ error: "Error al sortear" });
  }
};
