"use client";

import { SetStateAction, useEffect, useState } from "react";
import { Wallet, Package, History, BarChart3, Award, Ship } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  color: string;
  quantity: number;
}
interface TransactionItem {
  id: number;
  transactionType: "buy" | "sell";
  resourceId: string;
  quantity: number;
  totalPrice: number;
  pricePerUnit: number;
  timestamp: string;
}
interface AchievementItem {
  id: number;
  name: string;
  description: string;
  progress: number;
}
interface ProfileResponse {
  user: { fullName: SetStateAction<number>; balance: number };
  inventory: InventoryItem[];
  transactions: TransactionItem[];
  achievements: AchievementItem[];
  artifacts: ArtifactItem[];
}
interface ArtifactItem {
  id: number;
  name: string;
  description: string;
  image: string;
  rarity: string;
  acquiredAt: string;
}

export function ProfilePanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [fullName, setfullName] = useState(0);
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [history, setHistory] = useState<TransactionItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRarityTextClass = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-400';
      case 'epic': return 'text-blue-400';
      case 'rare': return 'text-green-400';
      default: return 'text-gray-300';
    }
  };

  const getRarityBadgeClass = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-purple-500/20 text-purple-300';
      case 'epic': return 'bg-blue-500/20 text-blue-300';
      case 'rare': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'Легендарный';
      case 'epic': return 'Эпический';
      case 'rare': return 'Редкий';
      default: return 'Обычный';
    }
  };

  const getPricePerUnit = (resourceId: string) => {
    const transactionsForResource = history.filter(
      (t) => t.resourceId === resourceId
    );
    if (transactionsForResource.length === 0) return 0;

    const sortedTransactions = [...transactionsForResource].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return sortedTransactions[0].pricePerUnit;
  };


  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/profile/`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Ошибка загрузки профиля');
        }
        const data: ProfileResponse = await res.json();
        setfullName(data.user.fullName)
        setBalance(data.user.balance);
        setInventory(data.inventory);
        setHistory(data.transactions);
        setAchievements(data.achievements);
        setArtifacts(data.artifacts || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-white">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-500">Ошибка: {error}</div>;

  return (
    <div className="rounded-xl bg-black/40 p-6 backdrop-blur-lg ">
      <div className="mb-6 flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
            <div className="h-full w-full rounded-full bg-black/50 p-2">
              <Ship className="h-full w-full text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{fullName}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 px-4 py-2">
            <div className="text-xs text-blue-300">Баланс</div>
            <div className="font-mono text-lg font-bold text-blue-400">
              {balance.toLocaleString()} $
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="mb-6 flex space-x-4 border-b border-gray-800">
        {[
          { id: "overview", icon: BarChart3, label: "Информация" },
          { id: "artifacts", icon: Ship, label: "Артефакты" },
          { id: "inventory", icon: Package, label: "Инвентарь" },
          { id: "history", icon: History, label: "История" },
          { id: "achievements", icon: Award, label: "Достижения" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === id
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Информация */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Статы */}
            <div className="space-y-4 rounded-lg border border-gray-800 bg-black/30 p-4">
              <h3 className="flex items-center gap-2 font-medium text-white">
                <Wallet className="h-4 w-4 text-blue-400" /> Краткая статистика
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <div className="text-sm text-gray-400">Количество сделок</div>
                  <div className="text-lg font-semibold text-white">{history.length}</div>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <div className="text-sm text-gray-400">Процент выкупа</div>
                  <div className="text-lg font-semibold text-green-400">
                    {history.length ? Math.round(history.filter(t => t.transactionType === 'buy').length / history.length * 100) : 0}%
                  </div>
                </div>
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <div className="text-sm text-gray-400">Репутация</div>
                  <div className="text-lg font-semibold text-blue-400">Элита</div>
                </div>
              </div>
            </div>

            {/* Топ ресурсы */}
            <div className="space-y-4 rounded-lg border border-gray-800 bg-black/30 p-4">
              <h3 className="flex items-center gap-2 font-medium text-white">
                <Package className="h-4 w-4 text-blue-400" /> Топ ресурсы
              </h3>
              <div className="space-y-3">
                {inventory.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3">
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-gray-400">{item.quantity} units</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-white">{(item.quantity * getPricePerUnit(item.id)).toLocaleString()} $</div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* Артефакты */}
        {activeTab === "artifacts" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="group relative overflow-hidden rounded-lg border border-gray-800 bg-black/30 transition-all hover:border-blue-500/50"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={artifact.image}
                      alt={artifact.name}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <div className={`text-sm font-semibold ${getRarityTextClass(artifact.rarity)}`}>
                      {artifact.name}
                    </div>
                    <div className="text-xs text-gray-400 line-clamp-2">
                      {artifact.description}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {new Date(artifact.acquiredAt).toLocaleDateString('ru-RU')}
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs ${getRarityBadgeClass(artifact.rarity)}`}>
                      {getRarityLabel(artifact.rarity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Инвентарь */}
        {activeTab === "inventory" && (
          <div className="overflow-hidden rounded-lg border border-gray-800">
            <table className="w-full">
              <thead className="border-b border-gray-800 bg-black/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Ресурс</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Количество</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Цена</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {inventory.map(item => (
                  <tr key={item.id} className="bg-black/30">
                    <td className="px-6 py-4 text-white">{item.name}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-300">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-mono text-white">{(item.quantity * getPricePerUnit(item.id)).toLocaleString()} $</td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700">
                        Продать
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* История */}
        {activeTab === "history" && (
          <div className="overflow-hidden rounded-lg border border-gray-800">
            <table className="w-full">
              <thead className="border-b border-gray-800 bg-black/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Дата</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Тип</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Ресурс</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Количество</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Цена</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.map((transaction) => {
                  const date = new Date(transaction.timestamp);
                  const resource = inventory.find(r => r.id === transaction.resourceId);

                  return (
                    <tr key={transaction.id} className="bg-black/30">
                      <td className="px-6 py-4 text-gray-300">
                        {date.toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${transaction.transactionType === "buy"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                          }`}>
                          {transaction.transactionType === 'buy' ? 'Покупка' : 'Продажа'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">
                        {resource?.name || 'Неизвестный ресурс'}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-gray-300">
                        {transaction.quantity}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-white">
                        {transaction.totalPrice.toLocaleString()} $
                      </td>
                    </tr>
                  )
                }
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Достижения */}
        {activeTab === "achievements" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="rounded-lg border border-gray-800 bg-black/30 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                    <Award className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{achievement.name}</div>
                    <div className="text-sm text-gray-400">{achievement.description}</div>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
                <div className="mt-2 text-right text-sm text-gray-400">
                  {achievement.progress}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}