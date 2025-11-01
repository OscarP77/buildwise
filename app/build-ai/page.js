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
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "erik", text: "Hej! Jag är Erik 💻 Din AI-byggassistent. Vad vill du ha hjälp med?" },
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

  // --- Chat-funktion (lokal) ---
  function sendChat() {
    if (!chatInput.trim()) return;
    setMessages((m) => [...m, { from: "user", text: chatInput }]);
    setChatInput("");
    // (placeholder-svar, vi kopplar OpenAI-API senare)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "erik",
          text: "Bra fråga! Jag analyserar dina val och återkommer snart 🔍",
        },
      ]);
    }, 600);
  }

  // --- UI ---
  return (
    <main className="min-h-screen bg-white text-black pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto border border-zinc-200 rounded-2xl bg-white shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Sidomeny */}
        <aside className="w-full md:w-64 border-b md:border-r border-zinc-200 p-5 bg-zinc-50">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase mb-4">
            Komponenter
          </h2>
          <div className="flex flex-col gap-3">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`w-full text-left text-[13px] font-medium rounded-lg border px-3 py-2 transition ${
                  activeCategory === c.key
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-white border-zinc-200 hover:border-purple-400 hover:text-purple-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Sammanfattning */}
          <div className="mt-8">
            <p className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wide">
              Ditt bygge
            </p>
            <ul className="text-[12px] text-zinc-700 space-y-1">
              {categories.map((c) => (
                <li key={c.key}>
                  {c.label}: {build[c.key]?.name || "—"}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Huvuddel */}
        <section className="flex-1 p-6 flex flex-col gap-6 bg-white">
          {/* Info-paneler */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoBox title="Totalt pris" value={totalPrice} color="purple" />
            <InfoBox
              title="Total strömförsörjning"
              value={totalPower}
              color="zinc"
            />
            <InfoBox
              title="Prestandapoäng"
              value={performanceScore}
              color="green"
            />
            <InfoBox
              title="Kompatibilitet"
              value={compatibilityStatus}
              color="blue"
            />
          </div>

          {/* Aktiv komponent */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 overflow-y-auto min-h-[300px] max-h-[60vh]">
            {!build[activeCategory] ? (
              <div>
                <h3 className="text-base font-semibold text-black mb-2">
                  {labelForCategory(activeCategory)} är inte valt ännu
                </h3>
                <p className="text-sm text-zinc-600 mb-4">
                  Här är några rekommenderade alternativ:
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <motion.button
                      key={n}
                      whileHover={{ scale: 1.03 }}
                      className="text-left rounded-lg border border-zinc-200 bg-white p-3 hover:border-purple-400 hover:shadow-[0_0_10px_rgba(147,51,234,0.2)] transition"
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
                      <p className="text-sm font-semibold text-black leading-snug">
                        {demoName(activeCategory, n)}
                      </p>
                      <p className="text-purple-600 text-[12px] font-medium mt-1">
                        {demoPrice(activeCategory, n)} kr
                      </p>
                      {demoWatt(activeCategory, n) && (
                        <p className="text-[11px] text-zinc-500 mt-1">
                          {demoWatt(activeCategory, n)} W
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-semibold text-black mb-2">
                  Vald {labelForCategory(activeCategory)}:
                </h3>
                <div className="rounded-lg border border-green-400 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-black">
                    {build[activeCategory]?.name}
                  </p>
                  <p className="text-green-600 text-[13px] font-medium mt-1">
                    {build[activeCategory]?.price} kr
                  </p>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() =>
                      setBuild((b) => ({ ...b, [activeCategory]: null }))
                    }
                    className="px-3 py-2 rounded-lg border border-red-400 text-red-500 bg-red-50 hover:bg-red-100 text-sm font-medium"
                  >
                    Ta bort
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-purple-400 text-purple-600 bg-purple-50 hover:bg-purple-100 text-sm font-medium">
                    Be Erik om nya alternativ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Spara / Export */}
          <div className="flex flex-col lg:flex-row gap-4">
            <button className="flex-1 rounded-xl border border-purple-400 bg-purple-50 text-purple-700 text-sm font-medium px-4 py-3 hover:bg-purple-100 transition">
              Spara bygget till mitt konto
            </button>
            <button className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-3 hover:bg-zinc-100 transition">
              Ladda ner specifikation som PDF
            </button>
          </div>
        </section>
      </div>

      {/* --- Erik-bubbla --- */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg px-5 py-3 text-sm font-semibold flex items-center gap-2 transition"
      >
        💬 Fråga Erik om hjälp
      </button>

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 w-80 bg-white border border-zinc-200 shadow-xl rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="bg-purple-600 text-white text-sm font-semibold px-4 py-2 flex justify-between items-center">
              <span>Erik – din AI-assistent 🤖</span>
              <button onClick={() => setShowChat(false)}>✕</button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`${
                    m.from === "erik"
                      ? "bg-purple-100 text-purple-900 self-start"
                      : "bg-zinc-200 text-black self-end"
                  } px-3 py-2 rounded-lg max-w-[80%]`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-zinc-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ställ en fråga till Erik..."
                className="flex-1 text-sm border border-zinc-300 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={sendChat}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg px-3 transition"
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
    purple: "text-purple-600 border-purple-200 bg-purple-50",
    zinc: "text-zinc-700 border-zinc-200 bg-zinc-50",
    green: "text-green-600 border-green-200 bg-green-50",
    blue: "text-blue-600 border-blue-200 bg-blue-50",
  };
  return (
    <div
      className={`rounded-xl border ${colorMap[color]} p-4 shadow-sm flex flex-col`}
    >
      <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">
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
