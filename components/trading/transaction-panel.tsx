"use client";

import { useState } from "react";
import { Resource } from "./trading-interface";

interface TransactionResponse {
  message: string;
  balance: number;
  inventory: number;
  transaction: any;
}

export function TransactionPanel({ resource }: { resource: Resource }) {
  const [quantity, setQuantity] = useState(1);
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalPrice = resource.price * quantity;
  const fees = totalPrice * 0.02;
  const grandTotal = transactionType === "buy"
    ? totalPrice + fees
    : totalPrice - fees;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Не авторизован");

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          resourceId: resource.id,
          quantity,
          transactionType,
          pricePerUnit: resource.price,
        }),
      });

      const data: TransactionResponse | { error: string } = await res.json();
      if (!res.ok) {
        throw new Error((data as any).error || "Ошибка транзакции");
      }

      setSuccess(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-xl bg-black/40 p-6 backdrop-blur-lg border-2 border-white">
      <h2 className="text-xl font-medium text-white">Торговля {resource.name}</h2>
      <p className="text-sm text-gray-400">{resource.description}</p>

      <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-black/50 p-4">
        <div>
          <div className="text-sm text-gray-400">Текущая цена</div>
          <div className="font-mono text-xl font-semibold text-white">
            {resource.price.toFixed(2)} $
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">24ч</div>
          <div className={resource.change >= 0 ? "text-green-400" : "text-red-400"}>
            {`${resource.change >= 0 ? "+" : ""}${resource.change}%`}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-400">{success}</div>}

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`rounded-lg py-2.5 text-sm font-medium ${
              transactionType === "buy"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
            onClick={() => setTransactionType("buy")}
          >
            Купить
          </button>
          <button
            type="button"
            className={`rounded-lg py-2.5 text-sm font-medium ${
              transactionType === "sell"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
            onClick={() => setTransactionType("sell")}
          >
            Продать
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Количество</label>
          <div className="flex">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="rounded-l-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-full border-y border-gray-700 bg-black text-center font-mono text-white outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="rounded-r-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
            >
              +
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-800 bg-black/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Цена за штуку</span>
            <span className="font-mono text-white">
              {resource.price.toFixed(2)} $
            </span>
          </div>
          <div className="my-2 flex items-center justify-between">
            <span className="text-sm text-gray-400">Количество</span>
            <span className="font-mono text-white">× {quantity}</span>
          </div>
          <div className="border-b border-gray-800 pt-1 mb-3"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Подытог</span>
            <span className="font-mono text-white">
              {totalPrice.toFixed(2)} $
            </span>
          </div>
          <div className="my-2 flex items-center justify-between">
            <span className="text-sm text-gray-400">Комиссия (2%)</span>
            <span className="font-mono text-white">{fees.toFixed(2)} $</span>
          </div>
          <div className="border-b border-gray-800 pt-1 mb-1"></div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-white">Итого</span>
            <span className="font-mono text-lg font-semibold text-white">
              {grandTotal.toFixed(2)} $
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-3 text-sm font-medium text-white ${
            transactionType === "buy"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-red-600 hover:bg-red-700"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading
            ? "Обработка..."
            : `${transactionType === "buy" ? "Купить" : "Продать"} ${
                resource.name
              }`}
        </button>
      </form>
    </div>
  );
}
