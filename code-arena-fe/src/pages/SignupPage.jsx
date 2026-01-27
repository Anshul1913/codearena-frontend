import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import AuthApi from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Enter a valid email.";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    validateForm();
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await AuthApi.requestSignupOtp(form.email);
      console.log("✅ OTP requested successfully");
      toast.success("📧 OTP sent to your email! Please check your inbox.");
      setShowOtpInput(true);
    } catch (error) {
      console.error("❌ OTP request failed:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const signupVerifyRequest = {
        email: form.email,
        otp: otp,
        signupRequest: {
          email: form.email,
          password: form.password,
          name: form.name,
          role: "PLAYER",
        },
      };

      const response = await AuthApi.verifySignupOtp(signupVerifyRequest);
      console.log("✅ Signup successful:", response);
      toast.success("🎉 Account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("❌ Signup verification failed:", error);
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    Object.keys(form).every((f) => form[f].trim() !== "") &&
    Object.keys(errors).every((key) => !errors[key]);

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
          {showOtpInput ? "Verify Your Email" : "Create your account"}
        </h2>

        {!showOtpInput ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm mb-1 text-muted">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-2 rounded-radius-lg bg-bg/70 border text-text placeholder-muted outline-none transition-all ${errors.name
                    ? "border-error focus:ring-error/50"
                    : "border-surface/50 focus:border-primary focus:ring-2 focus:ring-primary/50"
                  }`}
              />
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-muted">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-2 rounded-radius-lg bg-bg/70 border text-text placeholder-muted outline-none transition-all ${errors.email
                    ? "border-error focus:ring-error/50"
                    : "border-surface/50 focus:border-primary focus:ring-2 focus:ring-primary/50"
                  }`}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password with toggle */}
            <div className="relative">
              <label className="block text-sm mb-1 text-muted">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className={`w-full px-4 py-2 rounded-radius-lg bg-bg/70 border text-text placeholder-muted outline-none transition-all pr-10 ${errors.password
                      ? "border-error focus:ring-error/50"
                      : "border-surface/50 focus:border-primary focus:ring-2 focus:ring-primary/50"
                    }`}
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
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-2 font-display font-semibold rounded-radius-lg transition-all shadow-shadow-soft hover:shadow-shadow-strong ${isFormValid && !loading
                  ? "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02]"
                  : "bg-surface text-muted cursor-not-allowed"
                }`}
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center mb-4">
              <p className="text-sm text-muted">
                We've sent a verification code to
              </p>
              <p className="text-primary font-semibold">{form.email}</p>
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

            <button
              type="submit"
              disabled={loading || !otp.trim()}
              className={`w-full py-2 font-display font-semibold rounded-radius-lg transition-all shadow-shadow-soft hover:shadow-shadow-strong ${!loading && otp.trim()
                  ? "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02]"
                  : "bg-surface text-muted cursor-not-allowed"
                }`}
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtp("");
              }}
              className="w-full py-2 text-sm text-muted hover:text-primary transition-colors"
            >
              ← Back to signup form
            </button>
          </form>
        )}

        <p className="text-center text-sm text-muted mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
