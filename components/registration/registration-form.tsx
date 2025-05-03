"use client";

import { useState } from "react";
import { Rocket, ShieldCheck, User, Mail, Key } from "lucide-react";

export function RegistrationForm({ onRegister }: { onRegister: () => void }) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rank, setRank] = useState("captain");
  const [experience, setExperience] = useState("novice");
  const [station, setStation] = useState("alpha");
  const [capital, setCapital] = useState("10000");
  const [error, setError] = useState("");

  const handleNextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        // Регистрация
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            title: rank, 
            email,
            password,
            experience,
            station,
            capital,
          })
          
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Ошибка при регистрации");
        }

        // Логин
        const login = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password })
        });

        if (!login.ok) {
          const err = await login.json();
          throw new Error(err.error || "Ошибка при входе");
        }

        const data = await login.json();
        localStorage.setItem("token", data.token);

        onRegister();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="w-full space-y-8 rounded-2xl bg-black/40 p-8 backdrop-blur-xl border-1 border-white">
      <div className="text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            {step === 1 && <User className="h-8 w-8" />}
            {step === 2 && <ShieldCheck className="h-8 w-8" />}
            {step === 3 && <Rocket className="h-8 w-8" />}
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
          Создай свой профиль
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Присоединитесь к Crist Exchange и начните свое торговое путешествие
        </p>
      </div>

      {error && (
        <p className="text-center text-red-500 text-sm">{error}</p>
      )}

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Полное имя
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-600 bg-black/30 px-4 py-2 text-white placeholder-gray-400"
                placeholder="Введите свое имя"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-600 bg-black/30 px-4 py-2 pl-10 text-white"
                  placeholder="Введите email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Пароль
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-600 bg-black/30 px-4 py-2 pl-10 text-white"
                  placeholder="Введите пароль"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Выберите звание
              </label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-600 bg-black/30 px-4 py-2 text-white"
              >
                <option value="captain">Капитан</option>
                <option value="commander">Командир</option>
                <option value="admiral">Адмирал</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Опыт в торговле
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-600 bg-black/30 px-4 py-2 text-white"
              >
                <option value="novice">Новичок</option>
                <option value="intermediate">Средний</option>
                <option value="expert">Профи</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Домашняя станция
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-600 bg-black/30 px-4 py-2 text-white"
              >
                <option value="alpha">Alpha Centauri</option>
                <option value="proxima">Proxima B</option>
                <option value="trappist">Trappist-1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Ваш начальный капитал
              </label>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-600 bg-black/30 px-4 py-2 text-white"
                placeholder="Введите сумму"
                readOnly
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                  step >= i ? "bg-blue-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNextStep}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 text-sm font-medium text-white transition-all"
          >
            {step === 3 ? "Завершить регистрацию" : "Следующий шаг"}
          </button>
        </div>
      </div>
    </div>
  );
}
