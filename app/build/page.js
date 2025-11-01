"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function BuildPage() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    async function fetchBuilds() {
      setLoading(true);
      try {
        const res = await fetch("/api/build-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        const list = data.builds || data || [];
        setBuilds(list);
        setTimeout(() => {
          setAiMessage(
            `Erik: Jag hittade ${list.length} datorbyggen som matchar din profil. 💡`
          );
        }, 500);
      } catch {
        setErrorMsg("Kunde inte hämta byggförslag just nu.");
      } finally {
        setLoading(false);
      }
    }
    fetchBuilds();
  }, []);

  function calculateScore(build) {
    let score = 0;
    const cpu = (build.cpu || "").toLowerCase();
    const gpu = (build.gpu || "").toLowerCase();
    const price = parseInt(build.price) || 0;
    const ram = build.ram || 0;
    if (cpu.includes("i9") || cpu.includes("ryzen 9")) score += 3;
    if (gpu.includes("4090") || gpu.includes("7900")) score += 3;
    if (ram >= 32) score += 2;
    if (price < 15000) score += 1;
    if (price < 25000) score += 1;
    return Math.min(10, score);
  }

  const filteredBuilds = builds.filter((b) => {
    const q = search.toLowerCase();
    const haystack = [
      b.name,
      b.cpu,
      b.gpu,
      b.category,
      b.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  const getImage = (index) => `/dator${(index % 8) + 1}.jpg`;

  // 🔹 Skeleton shimmer komponent
  const SkeletonCard = () => (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-md animate-pulse overflow-hidden">
      <div className="w-full h-48 bg--to-r from-zinc-200 via-zinc-300 to-zinc-200 bg-size[200%_100%] animate-[shimmer_1.2s_infinite]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-zinc-200 rounded" />
        <div className="h-3 w-1/2 bg-zinc-200 rounded" />
        <div className="h-3 w-full bg-zinc-200 rounded" />
        <div className="h-3 w-5/6 bg-zinc-200 rounded" />
        <div className="h-8 w-full bg-zinc-300 rounded-lg mt-3" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-black pt-24 pb-20 px-6 overflow-hidden">
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Titel, sök och AI-meddelande */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-black">
              Datorbyggen för dig
            </h1>
            <p className="text-zinc-600 text-sm mt-1">
              Färdiga byggen anpassade efter budget och syfte.
            </p>
          </div>

          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Sök t.ex. '4070', 'budget', 'streaming'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-zinc-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>

        {aiMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-purple-50 border border-purple-200 text-purple-700 rounded-xl px-4 py-3 text-sm mb-8 shadow-sm"
          >
            {aiMessage}{" "}
            <Link href="/" className="underline hover:text-purple-800">
              Fråga Erik om att jämföra dessa byggen →
            </Link>
          </motion.div>
        )}

        {errorMsg && (
          <div className="text-center text-red-500 text-sm">{errorMsg}</div>
        )}
        {!loading && !errorMsg && filteredBuilds.length === 0 && (
          <div className="text-center text-zinc-500 text-sm">
            Inga byggen matchar din sökning.
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredBuilds.map((build, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 25px rgba(147, 51, 234, 0.35)",
                  }}
                  className="bg-white border border-zinc-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col"
                  onClick={() => setSelectedBuild(build)}
                >
                  <img
                    src={getImage(i)}
                    alt={build.name}
                    className="w-full h-48 object-contain p-3 bg-zinc-50 rounded-t-2xl"
                    onError={(e) => (e.target.style.display = "none")}
                  />

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-lg font-semibold text-black leading-snug">
                        {build.name || "Namnlöst bygge"}
                      </h2>
                      <p className="text-purple-600 text-sm font-medium mt-1">
                        {build.price ? `${build.price}` : "Pris saknas"}
                      </p>
                      <div className="text-xs text-zinc-600 mt-2 space-y-1">
                        {build.cpu && <p>CPU: {build.cpu}</p>}
                        {build.gpu && <p>GPU: {build.gpu}</p>}
                        {build.ram && <p>RAM: {build.ram} GB</p>}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-zinc-500">
                        Prestandapoäng: {calculateScore(build)} / 10
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBuild(build);
                        }}
                        className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition"
                      >
                        Visa detaljer
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedBuild && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelectedBuild(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded-3xl shadow-2xl border border-zinc-200 w-[90%] max-w-lg z-50 p-8 max-h-[80vh] overflow-y-auto"
            >
              <img
                src={getImage(0)}
                alt={selectedBuild.name}
                className="w-full h-48 object-contain mb-4"
              />
              <h2 className="text-xl font-semibold text-black">
                {selectedBuild.name || "Datorbygge"}
              </h2>
              <p className="text-purple-600 font-medium mt-1">
                {selectedBuild.price || "Pris ej tillgängligt"}
              </p>

              <div className="text-sm text-zinc-700 mt-4 space-y-1">
                {selectedBuild.cpu && <p>CPU: {selectedBuild.cpu}</p>}
                {selectedBuild.gpu && <p>GPU: {selectedBuild.gpu}</p>}
                {selectedBuild.ram && <p>RAM: {selectedBuild.ram} GB</p>}
                {selectedBuild.storage && <p>Lagring: {selectedBuild.storage}</p>}
                {selectedBuild.motherboard && (
                  <p>Moderkort: {selectedBuild.motherboard}</p>
                )}
                {selectedBuild.psu && <p>Nätaggregat: {selectedBuild.psu}</p>}
                {selectedBuild.case && <p>Chassi: {selectedBuild.case}</p>}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setSelectedBuild(null)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Stäng
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
