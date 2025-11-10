// routes/sorteo.routes.js
const { createSorteoSchema, updateSorteoSchema } = require("../validators/sorteoSchema.js");
const { createParticipanteSchema, updateParticipanteSchema } = require("../validators/participanteSchema.js");
const validateJson = require("../middlewares/validation.middleware.js");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware.js");
const { validateUser } = require("../middlewares/validateUser.middleware.js");

module.exports = app => {
    const router = require("express").Router();
    const controllerSorteo = require("../controllers/sorteo.controller.js");
    const controllerParticipante =  require("../controllers/participante.controller.js");

//con validacion de usuario
    router.get("/", validateUser,controllerSorteo.getAll);
    router.get("/:accessToken", validateUser, controllerSorteo.getByToken);
    router.get("/:accessToken/participantes", validateUser, controllerSorteo.getParticipantes);

    router.post("/", validateUser,isJsonRequestValid, validateJson(createSorteoSchema), controllerSorteo.create);
    router.put("/:accessToken", validateUser, isJsonRequestValid, validateJson(updateSorteoSchema), controllerSorteo.update);
    router.post("/:accessToken/sortear", validateUser, controllerSorteo.sortear);

    // Agregar participante al sorteo
    router.post("/:accessToken/participantes",validateUser,isJsonRequestValid,
        validateJson(createParticipanteSchema),controllerParticipante.createForSorteo
    );

    // Editar nombre del participante
    router.put("/participantes/:id", validateUser, isJsonRequestValid,
        validateJson(updateParticipanteSchema), controllerParticipante.updateName);

    // Eliminar participante
    router.delete("/participantes/:id", validateUser, controllerParticipante.remove);

    // Eliminar sorteo
    router.delete("/:accessToken", validateUser, controllerSorteo.remove);


    app.use('/sorteos', router);
};
