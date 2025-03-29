const express = require('express');
const router = express.Router();
const AuthController = require("../controllers/authController");


router.post('/signup', AuthController.signup);
router.post('/verify-signup-otp', AuthController.verifySignupOtp);
router.post('/login-request', AuthController.loginRequest);
router.post('/login-verify', AuthController.loginVerify);
router.post('/get-user-from-token', AuthController.getUserFromToken);
router.get('/users', AuthController.getAllUsers);
router.put('/update-verification', AuthController.updateVerificationStatus);
router.get("/check-verification/:user_id", AuthController.checkVerification);



module.exports = router;
