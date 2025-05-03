// "use client";

// import { useState, useEffect, useRef } from "react";
// import { ArrowUp, MessageSquare, Send, Award } from "lucide-react";

// interface Message {
//   id: number;
//   user: string;
//   text: string;
//   timestamp: Date;
// }

// export function AuctionPanel() {
//   const [currentBid, setCurrentBid] = useState(1000);
//   const [userCredits, setUserCredits] = useState(10000);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [timeLeft, setTimeLeft] = useState(300);
//   const [showBidAnimation, setShowBidAnimation] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleBid = () => {
//     const bidIncrement = Math.ceil(currentBid * 0.05);
//     const newBid = currentBid + bidIncrement;

//     if (userCredits >= newBid) {
//       setShowBidAnimation(true);
//       setTimeout(() => setShowBidAnimation(false), 1000);

//       setCurrentBid(newBid);
//       setUserCredits(userCredits - bidIncrement);
//       addMessage("System", `Новая ставка: ${newBid} $`);
//     }
//   };

//   const addMessage = (user: string, text: string) => {
//     setMessages((prev) => [
//       ...prev,
//       { id: Date.now(), user, text, timestamp: new Date() },
//     ]);
//   };

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       addMessage("You", newMessage.trim());
//       setNewMessage("");
//     }
//   };

//   return (
//     <div 
//       className={`transform transition-all duration-700 ${
//         isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
//       } rounded-xl bg-black/40 p-6 backdrop-blur-lg`}
//     >
//       <div className="flex items-start gap-6">
//         {/* Аукцион */}
//         <div className="flex-1 space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Award className="h-5 w-5 text-yellow-500" />
//               <h2 className="text-xl font-medium text-white">Аукцион</h2>
//             </div>
//             <div className="rounded-full bg-blue-900/50 px-3 py-1 text-sm text-blue-300">
//               Осталось времени: {formatTime(timeLeft)}
//             </div>
//           </div>

//           <div className="relative overflow-hidden rounded-lg border border-gray-800 bg-black/50 p-4">
//             {showBidAnimation && (
//               <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm">
//                 <div className="animate-ping text-2xl text-green-400">+5%</div>
//               </div>
//             )}

//             <div className="mb-4 text-center">
//               <div className="text-sm text-gray-400">Текущая ставка</div>
//               <div className="font-mono text-3xl font-bold text-white transition-all duration-300">
//                 {currentBid.toLocaleString()} $
//               </div>
//             </div>

//             <div className="mb-4 flex justify-between text-sm">
//               <div className="text-gray-400">Твой баланс</div>
//               <div className="font-mono text-white">{userCredits.toLocaleString()} $</div>
//             </div>

//             <button
//               onClick={handleBid}
//               className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-blue-600 py-2 font-medium text-white transition-all hover:bg-blue-700"
//             >
//               <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1s_ease-in-out_infinite]" />
//               <ArrowUp className="h-4 w-4" />
//               Поднять ставку (+5%)
//             </button>
//           </div>
//         </div>

//         {/* Чатик */}
//         <div className="flex h-[300px] flex-1 flex-col rounded-lg border border-gray-800 bg-black/50">
//           <div className="flex items-center gap-2 border-b border-gray-800 p-3">
//             <MessageSquare className="h-4 w-4 text-gray-400" />
//             <h3 className="text-sm font-medium text-white">Чат аукциона</h3>
//           </div>

//           <div className="flex-1 overflow-y-auto p-3 space-y-2">
//             {messages.map((message) => (
//               <div 
//                 key={message.id} 
//                 className="space-y-1 animate-[slideIn_0.3s_ease-out]"
//               >
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-sm font-medium text-blue-400">
//                     {message.user}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     {message.timestamp.toLocaleTimeString()}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-300">{message.text}</p>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="border-t border-gray-800 p-3">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                 placeholder="Type a message..."
//                 className="flex-1 rounded-lg border border-gray-700 bg-black/30 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="rounded-lg bg-blue-600 p-2 text-white transition-all duration-200 hover:bg-blue-700 hover:scale-105"
//               >
//                 <Send className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Award } from "lucide-react";

interface Message {
  id: number;
  userName: string;
  text: string;
  timestamp: Date;
}

interface BidHistoryItem {
  userName: string;
  amount: number;
  timestamp: number;
}

interface Artifact {
  id: number;
  name: string;
  description: string;
  rarity: string;
  image: string;
}

export function AuctionPanel() {
  const [currentBid, setCurrentBid] = useState(1000);
  const [bidStep, setBidStep] = useState(Math.ceil(1000 * 5 / 100));
  const [balance, setBalance] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([]);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [auctionId, setAuctionId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isConnected, setIsConnected] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [wonArtifact, setWonArtifact] = useState<Artifact | null>(null);
  const [isBidding, setIsBidding] = useState(false);

  const isLastBidFromUser = bidHistory.length > 0 && bidHistory[bidHistory.length - 1].userName === userName;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const connect = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Токен не найден. Пожалуйста, авторизуйтесь.");
        return;
      }

      const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000";
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        ws.send(JSON.stringify({ type: "auth", token }));
      };

      ws.onmessage = (e) => {
        let data: any;
        try {
          data = JSON.parse(e.data);
        } catch {
          console.error("Невалидный JSON:", e.data);
          return;
        }

        switch (data.type) {
          case "authSuccess":
            setUserId(data.userId);
            setUserName(data.userName);
            setBalance(data.balance);
            break;

          case "bidUpdate":
            setCurrentBid(Math.round(data.currentBid));
            setBidStep(Math.round(data.bidStep));
            setAuctionId(data.auctionId);
            setArtifact(data.artifact);
            break;

          case "bidHistory":
            setBidHistory(
              data.history.map((b: any) => ({
                userName: b.userName,
                amount: Math.round(b.amount),
                timestamp: b.timestamp,
              }))
            );
            setIsBidding(false);
            break;

          case "balanceUpdate":
            setBalance(data.balance);
            setIsBidding(false);
            break;

          case "timeUpdate":
            if (Date.now() - lastUpdate < 2000 && Math.abs(data.timeLeft - timeLeft) > 2) {
              break;
            }
            setTimeLeft(data.timeLeft);
            setLastUpdate(Date.now());
            break;

          case "chat":
            setMessages((prev) => [
              ...prev,
              {
                id: data.id,
                userName: data.userName,
                text: data.text,
                timestamp: new Date(data.timestamp),
              },
            ]);
            break;

          case "chatHistory":
            setMessages(
              data.messages.map((msg: any) => ({
                id: msg.id,
                userName: msg.userName,
                text: msg.text,
                timestamp: new Date(msg.timestamp),
              }))
            );
            break;

          case "auctionReset":
            setCurrentBid(Math.round(data.currentBid));
            setBidStep(Math.round(data.bidStep));
            setTimeLeft(data.timeLeft);
            setBidHistory([]);
            setArtifact(data.artifact);
            setAuctionId(data.auctionId);
            setNotification(null);
            break;

          case "auctionEnd":
            if (data.winner) {
              const isWinner = data.winner.id === userId;
              const winnerMessage = isWinner
                ? `Поздравляем ${data.winner.name}! Вы выиграли артефакт "${artifact?.name}"!`
                : `Аукцион завершён! Победитель: ${data.winner.name}`;
              setNotification(winnerMessage);
            } else {
              setNotification("Аукцион завершён! Победителя нет.");
            }
            setTimeout(() => setArtifact(null), 5000);
            break;

          case "cooldownStart":
            setNotification(`Следующий аукцион через: ${formatTime(data.duration)}`);
            setTimeLeft(data.duration);
            break;

          case "error":
            setError(data.message);
            setIsBidding(false);
            break;

          case "win":
            setWonArtifact(data.artifact);
            setShowWinModal(true);
            break;
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setError("Соединение закрыто, переподключение...");
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error("WS Error:", err);
        setError("Ошибка соединения.");
        ws.close();
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, []);

  const handleBid = () => {
    // Проверяем, не является ли пользователь автором последней ставки
    const lastBid = bidHistory[bidHistory.length - 1];
    if (lastBid && lastBid.userName === userName) {
      setError("Вы не можете сделать две ставки подряд");
      return;
    }

    if (isBidding) return;

    if (wsRef.current?.readyState === WebSocket.OPEN && auctionId !== null) {
      setIsBidding(true);
      wsRef.current.send(JSON.stringify({ type: "bid", auctionId }));
    } else {
      setError("Не удалось сделать ставку: нет соединения или аукцион не активен");
    }
  };

  const handleSendMessage = () => {
    const text = newMessage.trim();
    if (text && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "chat", text }));
      setNewMessage("");
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl bg-black/40 p-6 backdrop-blur-lg text-white">
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-red-200">
          {error}
        </div>
      )}
      {notification && (
        <div className="mb-4 rounded-lg bg-green-500/20 p-3 text-green-200">
          {notification}
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <header className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-medium">
              <Award className="h-5 w-5 text-yellow-400" />
              Аукцион артефактов
            </h2>
            <div className="rounded-full bg-blue-900/50 px-3 py-1 text-sm">
              Осталось: {formatTime(timeLeft)}
            </div>
          </header>

          {artifact ? (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-900/50 p-4">
              <img
                src={artifact.image}
                alt={artifact.name}
                className="h-12 w-12 rounded-md object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{artifact.name}</h3>
                <p className="text-sm text-gray-300">
                  {artifact.description}
                </p>
                <p className="text-xs text-gray-500">
                  Редкость: {artifact.rarity}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-lg bg-gray-900/50 p-4 text-gray-400">
              Ожидание артефакта...
            </div>
          )}

          <div className="relative overflow-hidden rounded-lg bg-black/50 border border-gray-800 p-4">
            <div className="mb-6 text-center">
              <div className="text-gray-400 text-sm">Текущая ставка</div>
              <div className="text-3xl font-bold">
                {currentBid.toLocaleString()} $
              </div>
            </div>

            <div className="mb-4 flex justify-between text-sm">
              <span className="text-gray-400">Баланс:</span>
              <span className="font-mono">
                {balance != null ? balance.toLocaleString() : "..."} $
              </span>
            </div>

            <button
              onClick={handleBid}
              disabled={
                !isConnected ||
                balance === null ||
                balance < bidStep ||
                auctionId === null ||
                isLastBidFromUser ||
                isBidding
              }
              className="w-full rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Сделать ставку (+{bidStep.toLocaleString()}) $
            </button>

            <div className="mt-4 border-t border-gray-800 pt-4">
              <h3 className="mb-2 text-sm font-medium">История ставок</h3>
              {bidHistory.length > 0 ? (
                <div className="space-y-2">
                  {bidHistory.map((bid, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-200"
                    >
                      <span>{bid.userName}</span>
                      <span>{bid.amount.toLocaleString()} $</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Ставок нет</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-96 flex-col rounded-lg bg-black/50 border border-gray-800">
          <div className="border-b border-gray-800 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              Аукционный чат
            </h3>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div key={idx} className="animate-fadeIn">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-sm ${msg.userName === userName
                          ? "text-green-400"
                          : "text-blue-400"
                        }`}
                    >
                      {msg.userName === userName ? "Вы" : msg.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">{msg.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Сообщений нет</p>
            )}
          </div>

          <div className="border-t border-gray-800 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSendMessage()
                }
                placeholder="Сообщение..."
                className="flex-1 rounded-lg border border-gray-700 bg-black/30 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="rounded-lg bg-blue-600 p-2 transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showWinModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="rounded-lg bg-gray-900 p-6 text-white max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Поздравляем!</h2>
            <p className="mb-4">Вы выиграли артефакт:</p>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={wonArtifact?.image || 'placeholder.jpg'}
                alt={wonArtifact?.name}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{wonArtifact?.name}</h3>
                <p className="text-sm text-gray-300">{wonArtifact?.description}</p>
                <p className="text-xs text-gray-500">Редкость: {wonArtifact?.rarity}</p>
              </div>
            </div>
            <button
              onClick={() => setShowWinModal(false)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}