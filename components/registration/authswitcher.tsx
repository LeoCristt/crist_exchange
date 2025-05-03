"use client";

import { useState } from "react";
import { RegistrationForm } from "./registration-form";
import { LoginForm } from "./login-form";

interface Props {
  onRegister: () => void;
  onLogin: () => void;
}

export default function AuthFormSwitcher({ onRegister, onLogin }: Props) {
  const [mode, setMode] = useState<"register" | "login">("register");

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setMode("register")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            mode === "register"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Регистрация
        </button>
        <button
          onClick={() => setMode("login")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            mode === "login"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Войти
        </button>
      </div>

      {mode === "register" ? (
        <RegistrationForm onRegister={onRegister} />
      ) : (
        <LoginForm onLogin={onLogin} />
      )}
    </div>
  );
}
