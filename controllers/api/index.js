const express = require("express");
const router = express.Router();

const userRoutes = require("./userController");
router.use("/users", userRoutes);

const thoughtRoutes = require("./thoughtController");
router.use("/thoughts", thoughtRoutes);

module.exports = router;