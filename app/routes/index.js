const express = require('express');
const authRoutes = require("../routes/authRoutes")
const tourRoutes = require("../routes/tourRoutes");
const router = express.Router();


router.use('/auth', authRoutes);
router.use("/tours", tourRoutes);

module.exports = router;