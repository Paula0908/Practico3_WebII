// controllers/public.controller.js
const db = require("../models");

// GET /public/sorteos/:accessToken
exports.viewSorteo = async (req, res) => {
  try {
    const sorteo = await db.sorteo.findOne({
      where: { accessToken: req.params.accessToken },
      attributes: ["id", "nombre", "fechaEvento", "isStarted"]
    });

    if (!sorteo) {
      return res.status(404).json({ message: "Link inválido" });
    }

    const disponibles = await db.participante.findAll({
      where: { sorteoId: sorteo.id, isIdentified: false },
      attributes: ["id", "nombreParticipante"],
      order: [["nombreParticipante", "ASC"]]
    });

    res.json({
      nombre: sorteo.nombre,
      fechaEvento: sorteo.fechaEvento,
      isStarted: sorteo.isStarted,
      participantesNoIdentificados: disponibles
    });
  } catch (e) {
    console.error("public.viewSorteo error:", e);
    res.status(500).json({ error: "Error al cargar sorteo público" });
  }
};

exports.identificar = async (req, res) => {
  try {
    const sorteo = await db.sorteo.findOne({
      where: { accessToken: req.params.accessToken },
    });

    if (!sorteo) {
      return res.status(404).json({ message: "Link inválido" });
    }

    const participanteId = req.body?.participanteId;
    if (!participanteId) {
      return res
        .status(400)
        .json({ message: "participanteId requerido" });
    }

    const p = await db.participante.findOne({
      where: { id: participanteId, sorteoId: sorteo.id },
      attributes: ["id", "isIdentified", "accessLinkToken"]
    });

    if (!p) {
      return res
        .status(404)
        .json({ message: "Participante no válido" });
    }

    if (p.isIdentified) {
      return res
        .status(409)
        .json({ message: "Ya fue identificado" });
    }

    await p.update({ isIdentified: true });

    res.json({
      accessLinkToken: p.accessLinkToken
    });
  } catch (e) {
    console.error("public.identificar error:", e);
    res.status(500).json({ error: "Error al identificar participante" });
  }
};

// GET /public/bolillo/:accessLinkToken
exports.getBolillo = async (req, res) => {
  try {
    const p = await db.participante.findOne({
      where: { accessLinkToken: req.params.accessLinkToken },
      attributes: ["id", "nombreParticipante", "wishlist", "sorteoId", "assignedToId"]
    });
    if (!p) return res.status(404).json({ message: "Link inválido" });

    const s = await db.sorteo.findByPk(p.sorteoId, {
      attributes: ["nombre", "fechaEvento", "isStarted"]
    });
    if (!s) {
      return res.status(404).json({ message: "Sorteo no encontrado" });
    }


    let asignado = null;
    if (p.assignedToId) {
      asignado = await db.participante.findByPk(p.assignedToId, {
        attributes: ["id", "nombreParticipante", "wishlist"]
      });
    }

    return res.json({
      sorteo: { nombre: s.nombre, fechaEvento: s.fechaEvento },
      yo: { id: p.id, nombreParticipante: p.nombreParticipante, wishlist: p.wishlist ?? "" },
      asignado: asignado ? {
        id: asignado.id,
        nombreParticipante: asignado.nombreParticipante,
        wishlist: asignado.wishlist ?? ""
      } : null
    });
  } catch (e) {
    console.error("public.getBolillo error:", e);
    return res.status(500).json({ error: "Error al cargar bolillo" });
  }
};


// PATCH /public/bolillo/:accessLinkToken/wishlist  { wishlist }
exports.updateWishlist = async (req, res) => {
  try {
    const wl = (req.body?.wishlist ?? "").toString();
    const p = await db.participante.findOne({
      where: { accessLinkToken: req.params.accessLinkToken },
      attributes: ["id"]
    });
    if (!p) return res.status(404).json({ message: "Link inválido" });

    await p.update({ wishlist: wl });
    res.json({ ok: true, wishlist: wl });
  } catch (e) {
    console.error("public.updateWishlist error:", e);
    res.status(500).json({ error: "Error al actualizar wishlist" });
  }
};
