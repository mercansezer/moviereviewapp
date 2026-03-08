const express = require("express");
const {
  createActor,
  updateActor,
  deleteActor,
  searchActor,
  getLatestActors,
  getSingleActor,
} = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");
const { isAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/createActor",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);

router.patch(
  "/updateActor/:id",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

router.delete("/deleteActor/:id", isAuth, isAdmin, deleteActor);
router.get("/searchActor", isAuth, isAdmin, searchActor);

router.get("/latest-actor", isAuth, isAdmin, getLatestActors);
router.get("/single/:id", getSingleActor);
module.exports = router;
