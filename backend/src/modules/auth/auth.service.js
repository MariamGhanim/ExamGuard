import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../../DB/models/user.model.js";
import { generateTemporaryPassword } from "../../utils/generatePassword.js";
import { sendEmail } from "../../utils/sendEmail.js";

// Register

export const registerService = async (nationalId, email) => {

    const existingUser = await User.findOne({
        $or: [
            { nationalId },
            { email }
        ]
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // Generate 6-digit temporary password
    const temporaryPassword = generateTemporaryPassword();

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const user = await User.create({
        nationalId,
        email,
        password: hashedPassword,
        isVerified: false,

        // Password is valid for only 30 seconds
        temporaryPasswordExpires: new Date(Date.now() + 30 * 1000)
    });

    // Send password to user's email
    await sendEmail(
        email,
        "ExamGuard Verification Code",
        `Your verification code is: ${temporaryPassword}

This code is valid for 30 seconds.`
    );

    return {
        message: "Verification code sent to your email"
    };
};



// Verify Registration

export const verifyRegistrationService = async (email, code) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isVerified) {
        throw new Error("User is already verified");
    }

    // Check if code expired
    if (
        !user.temporaryPasswordExpires ||
        user.temporaryPasswordExpires < new Date()
    ) {
        throw new Error("Verification code expired");
    }

    // Compare entered code with hashed password
    const isCorrect = await bcrypt.compare(code, user.password);

    if (!isCorrect) {
        throw new Error("Invalid verification code");
    }

    // Verification successful
    user.isVerified = true;
    user.temporaryPasswordExpires = null;

    await user.save();

    return {
        message: "Registration verified successfully"
    };
};



// Login

export const loginService = async (
    email,
    password,
    rememberMe
) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
        throw new Error("Please verify your account first");
    }

    const isCorrectPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!isCorrectPassword) {
        throw new Error("Invalid email or password");
    }

    // Remember Me
    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: rememberMe ? "30d" : "1d"
        }
    );

    return {
        message: "Login successful",
        token
    };
};



// Forgot Password

export const forgotPasswordService = async (email) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const resetCode = generateTemporaryPassword();

    user.resetCode = resetCode;

    // Reset code valid for 10 minutes
    user.resetCodeExpires = new Date(
        Date.now() + 10 * 60 * 1000
    );

    await user.save();

    await sendEmail(
        email,
        "ExamGuard Password Reset",
        `Your password reset code is: ${resetCode}

This code is valid for 10 minutes.`
    );

    return {
        message: "Reset code sent to your email"
    };
};


// =========================
// Verify Reset Code
// =========================
export const verifyResetCodeService = async (
    email,
    code
) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    if (
        !user.resetCodeExpires ||
        user.resetCodeExpires < new Date()
    ) {
        throw new Error("Reset code expired");
    }

    if (user.resetCode !== code) {
        throw new Error("Invalid reset code");
    }

    return {
        message: "Reset code verified successfully"
    };
};


// =========================
// Reset Password
// =========================
export const resetPasswordService = async (
    email,
    code,
    newPassword,
    confirmPassword
) => {

    if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
    }

    if (newPassword.length < 8) {
        throw new Error(
            "Password must be at least 8 characters"
        );
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    if (
        !user.resetCodeExpires ||
        user.resetCodeExpires < new Date()
    ) {
        throw new Error("Reset code expired");
    }

    if (user.resetCode !== code) {
        throw new Error("Invalid reset code");
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    user.password = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;

    await user.save();

    return {
        message: "Password reset successfully"
    };
};