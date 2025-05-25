// src/auth/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";
import { useAuth } from "./useAuth";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Helper: pretty console banner
   */
  const log = (msg: string, data?: unknown) =>
    console.log(`%c🔑 Login ► ${msg}`, "color:#4e88ff;font-weight:bold", data ?? "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    log("submitted", { username });

    try {
      /* 1️⃣  Get access / refresh */
      const { data: tokenData } = await api.post("token/", {
        username,
        password,
      });
      log("token OK", tokenData);

      /* 2️⃣  Save tokens in context + localStorage */
      await login(tokenData.access, tokenData.refresh); // NOTE: our AuthProvider.login is async

      /* 3️⃣  Fetch profile (/auth/me/) */
      const { data: profile } = await api.get("auth/me/");
      log("/me OK", profile);

      /* 4️⃣  Persist profile for dev-tools inspection */
      localStorage.setItem("user", JSON.stringify(profile));

      const role = profile.role as "merchant" | "customer";
      log("role detected", role);

      toast.success("🎉 Login successful!");

      /* 5️⃣  WAIT one micro-tick so RoleRoute sees fresh context */
      await Promise.resolve();

      /* 6️⃣  Redirect */
      const target = role === "merchant" ? "/merchant" : "/user";
      log("navigate →", target);
      navigate(target);
    } catch (err) {
      console.error("Login error", err);
      toast.error("❌ Login failed: invalid username / password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="card-title justify-center text-3xl mb-4">Login</h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>

          <p className="text-center mt-2">
            Don’t have an account?{" "}
            <a href="/register" className="link link-primary">
              Register
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
