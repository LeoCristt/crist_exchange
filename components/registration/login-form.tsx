"use client";

import { useState } from "react";
import { Mail, Key } from "lucide-react";

export function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Ошибка при входе");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full space-y-6 rounded-2xl bg-black/40 p-8 backdrop-blur-xl border border-white">
      <h2 className="text-3xl font-bold text-center text-white">Вход</h2>
      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-600 bg-black/30 px-4 py-2 pl-10 text-white"
              placeholder="Введите email"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300">Пароль</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-600 bg-black/30 px-4 py-2 pl-10 text-white"
              placeholder="Введите пароль"
            />
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
