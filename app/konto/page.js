"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function KontoPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  // --- CHECK LOGIN ---
  useEffect(() => {
    const session = localStorage.getItem("bw_session");
    const mail = localStorage.getItem("bw_email");
    if (!session) {
      router.push("/login");
      return;
    }
    setIsLoggedIn(true);
    setEmail(mail || "");
  }, [router]);

  // --- LOAD SAVED BUILDS ---
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("bw_saved")) || [];
      setSavedBuilds(stored);
    } catch {
      setSavedBuilds([]);
    }
  }, []);

  // --- REMOVE SAVED BUILD ---
  function removeBuild(index) {
    const updated = savedBuilds.filter((_, i) => i !== index);
    setSavedBuilds(updated);
    localStorage.setItem("bw_saved", JSON.stringify(updated));
  }

  // --- LOGOUT ---
  function handleLogout() {
    localStorage.removeItem("bw_session");
    localStorage.removeItem("bw_email");
    router.push("/login");
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-b from-black via-zinc-900 to-zinc-800 text-zinc-300">
        <p className="text-sm">Laddar konto...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-black via-zinc-900 to-zinc-800 text-white pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-white mb-2">Mitt konto</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Inloggad som <span className="text-purple-400 font-medium">{email}</span>
        </p>

        {/* LOGOUT KNAPP */}
        <button
          onClick={() => setShowConfirmLogout(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-purple-900/30 transition"
        >
          Logga ut
        </button>

        {/* Sparade byggen */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            Dina sparade byggen ❤️
          </h2>

          {savedBuilds.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Du har inte sparat några byggen ännu. Gå till{" "}
              <a href="/build" className="text-purple-400 hover:underline">
                /build
              </a>{" "}
              och spara några!
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedBuilds.map((build, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-zinc-900/60 border border-purple-700/30 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-purple-700/20 transition duration-300 flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base leading-snug">
                      {build.name || "Namnlöst bygge"}
                    </h3>
                    <div className="text-xs text-purple-400 mt-1">
                      {build.price ? build.price + " kr" : "Pris ej tillgängligt"}
                    </div>

                    <div className="text-[11px] text-zinc-400 mt-3 space-y-1">
                      {build.cpu && <p>CPU: {build.cpu}</p>}
                      {build.gpu && <p>GPU: {build.gpu}</p>}
                      {build.ram && <p>RAM: {build.ram} GB</p>}
                    </div>

                    {build.description && (
                      <p className="text-[11px] text-zinc-300 mt-3 line-clamp-3">
                        {build.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <button
                      onClick={() => removeBuild(index)}
                      className="text-zinc-400 hover:text-red-400 transition"
                    >
                      🗑 Ta bort
                    </button>

                    <button
                      onClick={() =>
                        alert("Kommer snart: exportera eller dela bygg 👀")
                      }
                      className="text-purple-400 hover:text-purple-300 transition font-medium"
                    >
                      🔗 Dela
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Logout confirm modal */}
      <AnimatePresence>
        {showConfirmLogout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setShowConfirmLogout(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 text-white rounded-3xl shadow-2xl border border-purple-800/40 w-[90%] max-w-sm z-50 p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                Logga ut?
              </h3>
              <p className="text-sm text-zinc-300 mb-6">
                Är du säker på att du vill logga ut från ditt konto?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="text-zinc-400 hover:text-zinc-300 text-sm"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-purple-900/30 transition"
                >
                  Logga ut
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
