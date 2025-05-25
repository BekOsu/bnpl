import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("❌ Passwords do not match.");
      return;
    }

    try {
      await api.post("auth/register/", {
        username,
        email,
        password,
        password2,
        role,
      });

      toast.success("🎉 Registration successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err.response?.data);
      toast.error("❌ Registration failed. Try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="card-title justify-center text-3xl mb-4">Register</h1>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="customer">customer</option>
              <option value="merchant">merchant</option>
            </select>
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </form>

          <p className="text-center mt-2">
            Already have an account?{" "}
            <a href="/login" className="link link-primary">
              Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
