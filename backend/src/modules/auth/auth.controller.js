import {
    registerService,
    verifyRegistrationService,
    loginService,
    forgotPasswordService,
    verifyResetCodeService,
    resetPasswordService
} from "./auth.service.js";


// Register
export const register = async (req, res) => {

    try {

        const { nationalId, email } = req.body;

        const result = await registerService(
            nationalId,
            email
        );

        res.status(201).json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// Verify Registration
export const verifyRegistration = async (req, res) => {

    try {

        const { email, code } = req.body;

        const result = await verifyRegistrationService(
            email,
            code
        );

        res.status(200).json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// Login
export const login = async (req, res) => {

    try {

        const {
            email,
            password,
            rememberMe
        } = req.body;

        const result = await loginService(
            email,
            password,
            rememberMe
        );

        res.status(200).json(result);

    } catch (error) {

        res.status(401).json({
            message: error.message
        });
    }
};


// Forgot Password
export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const result = await forgotPasswordService(email);

        res.status(200).json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// Verify Reset Code
export const verifyResetCode = async (req, res) => {

    try {

        const { email, code } = req.body;

        const result = await verifyResetCodeService(
            email,
            code
        );

        res.status(200).json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


// Reset Password
export const resetPassword = async (req, res) => {

    try {

        const {
            email,
            code,
            newPassword,
            confirmPassword
        } = req.body;

        const result = await resetPasswordService(
            email,
            code,
            newPassword,
            confirmPassword
        );

        res.status(200).json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};