import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import AuthApi from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            await AuthApi.requestForgotPasswordOtp(email);
            console.log("✅ Forgot password OTP requested");
            toast.success("📧 OTP sent to your email! Please check your inbox.");
            setShowOtpInput(true);
        } catch (error) {
            console.error("❌ OTP request failed:", error);
            toast.error(error.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            toast.error("Please enter the OTP.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const resetPasswordDTO = {
                email: email,
                otp: otp,
                newPassword: newPassword,
            };

            await AuthApi.resetPassword(resetPasswordDTO);
            console.log("✅ Password reset successful");
            toast.success("🎉 Password reset successfully! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error("❌ Password reset failed:", error);
            toast.error(error.message || "Invalid OTP or reset failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg text-text font-sans relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 bg-surface/80 backdrop-blur-md border border-surface/50 rounded-radius-xl p-8 w-[90%] max-w-md shadow-shadow-soft"
            >
                <h1 className="text-3xl font-display font-extrabold text-center mb-6">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        CodeArena
                    </span>
                </h1>
                <h2 className="text-xl text-center font-semibold mb-6 text-muted">
                    {showOtpInput ? "Reset Your Password" : "Forgot Password"}
                </h2>

                {!showOtpInput ? (
                    <form onSubmit={handleRequestOtp} className="space-y-5">
                        <div className="text-center mb-4">
                            <p className="text-sm text-muted">
                                Enter your email address and we'll send you an OTP to reset your password.
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm mb-1 text-muted">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email.trim()}
                            className={`w-full py-2 font-display font-semibold rounded-radius-lg transition-all shadow-shadow-soft hover:shadow-shadow-strong ${!loading && email.trim()
                                    ? "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02]"
                                    : "bg-surface text-muted cursor-not-allowed"
                                }`}
                        >
                            {loading ? "Sending OTP..." : "Request OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="text-center mb-4">
                            <p className="text-sm text-muted">
                                We've sent a verification code to
                            </p>
                            <p className="text-primary font-semibold">{email}</p>
                        </div>

                        {/* OTP Input */}
                        <div>
                            <label className="block text-sm mb-1 text-muted">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50 text-center text-2xl tracking-widest"
                            />
                        </div>

                        {/* New Password */}
                        <div className="relative">
                            <label className="block text-sm mb-1 text-muted">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text placeholder-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/50 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-muted hover:text-primary transition-colors bg-transparent border-none p-0 outline-none focus:ring-0 focus:outline-none"
                                    style={{ background: "none" }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-muted mt-1">Minimum 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !otp.trim() || newPassword.length < 6}
                            className={`w-full py-2 font-display font-semibold rounded-radius-lg transition-all shadow-shadow-soft hover:shadow-shadow-strong ${!loading && otp.trim() && newPassword.length >= 6
                                    ? "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02]"
                                    : "bg-surface text-muted cursor-not-allowed"
                                }`}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowOtpInput(false);
                                setOtp("");
                                setNewPassword("");
                            }}
                            className="w-full py-2 text-sm text-muted hover:text-primary transition-colors"
                        >
                            ← Back to email input
                        </button>
                    </form>
                )}

                <p className="text-center text-sm text-muted mt-5">
                    Remember your password?{" "}
                    <a href="/login" className="text-primary hover:underline">
                        Login
                    </a>
                </p>
            </motion.div>
        </div>
    );
}
