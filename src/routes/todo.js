const express = require("express");
const { create, getAll, getOne, update, destroy } = require("../handlers/todoHandler");
const { verifyToken } = require("../middlewares/authJwt");
const router = express.Router();

// router.get("/", function () {});

router.post("/", verifyToken, create);
router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getOne);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, destroy);

module.exports = router;
