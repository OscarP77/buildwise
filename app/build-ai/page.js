"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BuildAIPage() {
  const [build, setBuild] = useState({
    cpu: null,
    gpu: null,
    ram: null,
    motherboard: null,
    storage: null,
    psu: null,
    case: null,
    cooler: null,
    fans: null,
    os: null,
  });
  const [activeCategory, setActiveCategory] = useState("cpu");

  // CHAT STATES
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    { from: "erik", text: "Hej! Jag heter Erik ☀️ Vad vill du ha hjälp med i datorbygget?" },
  ]);

  // --- Kalkyler ---
  const totalPower = useMemo(() => {
    let watt = 0;
    if (build.cpu?.watt) watt += build.cpu.watt;
    if (build.gpu?.watt) watt += build.gpu.watt;
    return watt ? `${watt} W` : "—";
  }, [build]);

  const totalPrice = useMemo(() => {
    let sum = 0;
    Object.values(build).forEach((p) => p?.price && (sum += p.price));
    return sum ? `${sum} kr` : "—";
  }, [build]);

  const performanceScore = useMemo(() => {
    let score = 0;
    if (build.cpu) score += 2;
    if (build.gpu) score += 4;
    if (build.ram) score += 1;
    if (build.storage) score += 1;
    if (build.motherboard) score += 1;
    return score ? `${Math.min(score, 10)}/10` : "—";
  }, [build]);

  const compatibilityStatus = useMemo(() => {
    if (build.cpu && build.motherboard) return "Alla delar är kompatibla ✅";
    return "Kompatibilitet ännu ej kontrollerad ⚙️";
  }, [build]);


  // ✅ NY SENDCHAT — HELT FIXAD
  async function sendChat() {
    if (!chatInput.trim() || sending) return;

    const userMsg = { from: "user", text: chatInput.trim() };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setChatInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      setMessages((m) => [...m, { from: "erik", text: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { from: "erik", text: "Något gick fel – försök igen om en stund 🙏" },
      ]);
    } finally {
      setSending(false);
    }
  }

  // ✅ KATEGORIER
  const categories = [
    { key: "cpu", label: "CPU" },
    { key: "gpu", label: "Grafikkort" },
    { key: "ram", label: "RAM-minne" },
    { key: "motherboard", label: "Moderkort" },
    { key: "storage", label: "Lagring" },
    { key: "psu", label: "Nätaggregat" },
    { key: "case", label: "Chassi" },
    { key: "cooler", label: "CPU-kylare" },
    { key: "fans", label: "Extra fläktar" },
    { key: "os", label: "Operativsystem" },
  ];

  return (
    <main className="min-h-screen bg-[#f4ede3] text-[#3c2e1e] pt-24 pb-20 px-4 md:px-8">

      <div className="max-w-7xl mx-auto border border-[#dbcbb4] rounded-2xl bg-[#f9f4ec] shadow-lg flex flex-col md:flex-row overflow-hidden">

        {/* SIDOMENY */}
        <aside className="w-full md:w-64 border-b md:border-r border-[#dbcbb4] p-5 bg-[#f1e7d7]">
          <h2 className="text-xs font-semibold text-[#7a5f39] uppercase mb-4 tracking-wide">
            Komponenter
          </h2>

          <div className="flex flex-col gap-3">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`w-full text-left text-[13px] font-medium rounded-lg border px-3 py-2 transition ${
                  activeCategory === c.key
                    ? "bg-[#b89b6e] text-white border-[#a1845e]"
                    : "bg-[#fffaf3] border-[#dbcbb4] hover:border-[#b89b6e] hover:text-[#7a5f39]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-[11px] text-[#7a5f39] mb-2 uppercase tracking-wide">Ditt bygge</p>
            <ul className="text-[12px] text-[#6e502e] space-y-1">
              {categories.map((c) => (
                <li key={c.key}>
                  {c.label}: {build[c.key]?.name || "—"}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* HUVUDDEL */}
        <section className="flex-1 p-6 flex flex-col gap-6 bg-[#f9f4ec]">

          {/* Info paneler */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoBox title="Totalt pris" value={totalPrice} color="gold" />
            <InfoBox title="Total strömförsörjning" value={totalPower} color="sand" />
            <InfoBox title="Prestandapoäng" value={performanceScore} color="green" />
            <InfoBox title="Kompatibilitet" value={compatibilityStatus} color="brown" />
          </div>

          {/* Aktiv komponent */}
          <div className="rounded-xl border border-[#dbcbb4] bg-[#f4ede3] p-6 overflow-y-auto min-h-[300px] max-h-[60vh]">

            {!build[activeCategory] ? (
              <div>
                <h3 className="text-base font-semibold text-[#3c2e1e] mb-2">
                  {labelForCategory(activeCategory)} är inte valt ännu
                </h3>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <motion.button
                      key={n}
                      whileHover={{ scale: 1.03 }}
                      className="text-left rounded-lg border border-[#dbcbb4] bg-[#fffaf3] p-3 hover:border-[#b89b6e] hover:shadow-[0_0_10px_rgba(184,155,110,0.25)]"
                      onClick={() =>
                        setBuild((b) => ({
                          ...b,
                          [activeCategory]: {
                            name: demoName(activeCategory, n),
                            price: demoPrice(activeCategory, n),
                            watt: demoWatt(activeCategory, n),
                          },
                        }))
                      }
                    >
                      <p className="text-sm font-semibold text-[#3c2e1e]">
                        {demoName(activeCategory, n)}
                      </p>
                      <p className="text-[#b89b6e] text-[12px] font-medium">{demoPrice(activeCategory, n)} kr</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-semibold mb-2">
                  Vald {labelForCategory(activeCategory)}:
                </h3>

                <div className="rounded-lg border border-[#a3d9a5] bg-[#e9f9ea] p-4">
                  <p className="font-semibold">{build[activeCategory]?.name}</p>
                  <p className="text-green-700">{build[activeCategory]?.price} kr</p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setBuild((b) => ({ ...b, [activeCategory]: null }))}
                    className="px-3 py-2 rounded-lg border border-[#e3b2b2] text-[#a54c4c] bg-[#fbecec]"
                  >
                    Ta bort
                  </button>

                  <button
                    onClick={() => setShowChat(true)}
                    className="px-3 py-2 rounded-lg border border-[#b89b6e] bg-[#f4ede3]"
                  >
                    Be Erik om nya alternativ
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>

      {/* CHAT BUTTON */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-[#b89b6e] text-white rounded-full px-5 py-3 shadow-xl"
      >
        💬 Fråga Erik om hjälp
      </button>

      {/* CHAT BOX */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-20 right-6 w-80 bg-[#fffaf3] border border-[#dbcbb4] shadow-2xl rounded-2xl flex flex-col"
          >
            <div className="bg-[#b89b6e] text-white px-4 py-2 text-sm font-semibold flex justify-between">
              <span>Erik – din AI-assistent 🤖</span>
              <button onClick={() => setShowChat(false)}>✕</button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-lg max-w-[80%] ${
                    m.from === "erik"
                      ? "bg-[#eadfcf] text-[#6e502e]"
                      : "bg-[#d6c7b3] text-[#3c2e1e] self-end"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {sending && (
                <div className="bg-[#eadfcf] text-[#6e502e] px-3 py-2 rounded-lg max-w-[80%] italic opacity-80">
                  Erik skriver…
                </div>
              )}
            </div>

            <div className="p-2 border-t border-[#dbcbb4] flex gap-2 bg-[#f4ede3]">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ställ en fråga..."
                className="flex-1 text-sm border border-[#cdbba5] rounded-lg px-2 py-1 bg-white/80"
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
              />
              <button
                onClick={sendChat}
                disabled={sending}
                className="bg-[#b89b6e] text-white rounded-lg px-3"
              >
                Skicka
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

// --- Hjälpfunktioner ---
function InfoBox({ title, value, color }) {
  const colorMap = {
    gold: "text-[#b89b6e] border-[#e6d5be] bg-[#faf5ee]",
    sand: "text-[#7a5f39] border-[#dbcbb4] bg-[#f4ede3]",
    green: "text-green-700 border-green-200 bg-green-50",
    brown: "text-[#6e502e] border-[#dbcbb4] bg-[#f1e7d7]",
  };

  return (
    <div className={`rounded-xl border p-4 shadow-sm flex flex-col ${colorMap[color]}`}>
      <p className="text-[11px] uppercase tracking-wide text-[#7a5f39] mb-1">
        {title}
      </p>
      <p className="text-base font-semibold leading-tight">{value}</p>
    </div>
  );
}

function labelForCategory(k) {
  const map = {
    cpu: "CPU",
    gpu: "Grafikkort",
    ram: "RAM-minne",
    motherboard: "Moderkort",
    storage: "Lagring",
    psu: "Nätaggregat",
    case: "Chassi",
    cooler: "CPU-kylare",
    fans: "Fläktar",
    os: "Operativsystem",
  };
  return map[k] || k;
}

function demoName(cat, n) {
  const data = {
    cpu: ["Ryzen 5 7600", "Intel i5-13600K", "Ryzen 7 7800X3D"],
    gpu: ["RTX 4060", "RTX 4070 Super", "RX 7800 XT"],
    ram: ["32GB DDR5", "64GB DDR5", "16GB DDR4"],
    motherboard: ["MSI B650 Tomahawk", "ASUS TUF B760-PLUS", "Gigabyte X670"],
    storage: ["1TB NVMe SSD", "2TB NVMe SSD", "1TB SATA SSD"],
    psu: ["650W Gold", "750W Gold", "850W Platinum"],
    case: ["Fractal North", "NZXT H6 Flow", "Lian Li O11 Dynamic"],
    cooler: ["BeQuiet Pure Rock 2", "NZXT Kraken 240", "Noctua NH-U12A"],
    fans: ["3x Noctua 120mm", "Corsair QL120", "Arctic P12-pack"],
    os: ["Windows 11", "Windows 10", "Linux Ubuntu"],
  };
  return data[cat]?.[n - 1] || "Del";
}

function demoWatt(cat, n) {
  if (cat === "cpu") return [65, 125, 120][n - 1];
  if (cat === "gpu") return [140, 200, 260][n - 1];
  return null;
}

function demoPrice(cat, n) {
  const data = {
    cpu: [2490, 3290, 4590],
    gpu: [3990, 6490, 5690],
    ram: [1090, 1990, 790],
    motherboard: [2190, 1990, 3190],
    storage: [1190, 1990, 1490],
    psu: [990, 1290, 1690],
    case: [1490, 1690, 1890],
    cooler: [690, 1390, 990],
    fans: [390, 690, 990],
    os: [1390, 1290, 0],
  };
  return data[cat]?.[n - 1] || 0;
}
