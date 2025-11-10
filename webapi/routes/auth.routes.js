const validateJson = require("../middlewares/validation.middleware.js");
const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware.js");
const { loginSchema, registerSchema } = require("../validators/authSchema.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/auth.controller.js");

    router.post("/login", isJsonRequestValid, validateJson(loginSchema), controller.login);
    router.post("/register", isJsonRequestValid, validateJson(registerSchema), controller.register);
    app.use('/auth', router);
};