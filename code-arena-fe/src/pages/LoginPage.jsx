import React, { useState } from "react";
import { motion } from "framer-motion";
import AuthApi from "../services/AuthService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Login Form Data:", form);
    try {
        const loginDTO = { email: form.username, password: form.password };
      const data = await AuthApi.login(loginDTO);
    //   const data = await AuthApi.login({ username: form.username, password: form.password });
    const { jwtToken } = data;
        Cookies.set('jwtToken', jwtToken);
        const storedJwtToken = Cookies.get('jwtToken');

         console.log("JWT Token:", jwtToken);
         console.log("Stored JWT Token:", storedJwtToken);

    console.log("Login Success:", data);
    toast.success("🎉 Login successful!");
  } catch (error) {

    toast.error(error.message || "Login failed. Please try again.");
    console.error("Login Failed:", error);
  }
  };
   

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text font-sans relative overflow-hidden">
      {/* Glow */}
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
        <h2 className="text-xl text-center font-semibold mb-6 text-muted">Login to your account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-muted">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-muted">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-radius-lg bg-bg/70 border border-surface/50 text-text placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-display font-semibold py-2 rounded-radius-lg hover:scale-[1.02] transition-all shadow-shadow-soft hover:shadow-shadow-strong"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-5">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
export default LoginPage;