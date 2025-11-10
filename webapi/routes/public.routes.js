// routes/public.routes.js

const isJsonRequestValid = require("../middlewares/isJsonRequestValid.middleware.js");
const validateJson = require("../middlewares/validation.middleware.js");
const { identificarSchema, wishlistSchema } = require("../validators/publicSchema.js");
module.exports = (app) => {
  let router = require("express").Router();
  const public = require("../controllers/public.controller.js");

  //sin validacion de usuario
  router.get("/sorteos/:accessToken", public.viewSorteo);
  router.post("/sorteos/:accessToken/identificar", isJsonRequestValid, validateJson(identificarSchema), public.identificar);

  router.get("/bolillo/:accessLinkToken", public.getBolillo);
  router.patch("/bolillo/:accessLinkToken/wishlist", isJsonRequestValid, validateJson(wishlistSchema), public.updateWishlist);

  app.use("/public", router);
};
