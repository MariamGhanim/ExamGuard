import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        nationalId: {
            type: String,
            required: true,
            unique: true,
            match: /^[0-9]{14}$/
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },

        password: {
            type: String,
            required: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        temporaryPasswordExpires: {
            type: Date,
            default: null
        },

        resetCode: {
            type: String,
            default: null
        },

        resetCodeExpires: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);