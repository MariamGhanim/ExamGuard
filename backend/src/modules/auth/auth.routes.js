import express from "express";

import {
    register,
    verifyRegistration,
    login,
    forgotPassword,
    verifyResetCode,
    resetPassword
} from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/verify-registration", verifyRegistration);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-code", verifyResetCode);

router.post("/reset-password", resetPassword);

export default router;