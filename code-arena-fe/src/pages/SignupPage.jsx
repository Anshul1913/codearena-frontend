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
    phone: "",
    password: "",
  });

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
    if (!form.phone.match(/^[0-9]{10}$/))
      newErrors.phone = "Enter a valid 10-digit phone number.";
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await AuthApi.signupPlayer(form);
      console.log("✅ Signup successful:", response);
      toast.success("🎉 Signup successful! Please log in.");
        navigate("/login");
    //   alert("Signup successful! Please log in.");
      // e.g., navigate("/login");
    } catch (error) {
      console.error("❌ Signup failed:", error);
        toast.error(error.message || "Signup failed. Please try again.");
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
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1 text-muted">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2 rounded-radius-lg bg-bg/70 border text-text placeholder-muted outline-none transition-all ${
                errors.name
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
              className={`w-full px-4 py-2 rounded-radius-lg bg-bg/70 border text-text placeholder-muted outline-none transition-all ${
                errors.email
                  ? "border-error focus:ring-error/50"
                  : "border-surface/50 focus:border-primary focus:ring-2 focus:ring-primary/50"
              }`}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1 text-muted">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className={`w-full px-4 py-2 rounded-radius-lg bg-bg/70 border text-text placeholder-muted outline-none transition-all ${
                errors.phone
                  ? "border-error focus:ring-error/50"
                  : "border-surface/50 focus:border-primary focus:ring-2 focus:ring-primary/50"
              }`}
            />
            {errors.phone && (
              <p className="text-error text-sm mt-1">{errors.phone}</p>
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
                className={`w-full px-4 py-2 rounded-radius-lg bg-bg/70 border text-text placeholder-muted outline-none transition-all pr-10 ${
                  errors.password
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
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-2 font-display font-semibold rounded-radius-lg transition-all shadow-shadow-soft hover:shadow-shadow-strong ${
              isFormValid && !isSubmitting
                ? "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02]"
                : "bg-surface text-muted cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

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
