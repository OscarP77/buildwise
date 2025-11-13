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
      <main className="min-h-screen flex items-center justify-center bg-[#f4ede3] text-[#6e502e]">
        <p className="text-sm">Laddar konto...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4ede3] text-[#3c2e1e] pt-28 pb-20 px-6">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#6e502e]">Mitt konto</h1>
          <p className="text-[#7a5f39] text-sm mt-1">
            Inloggad som{" "}
            <span className="text-[#b89b6e] font-medium">{email}</span>
          </p>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => setShowConfirmLogout(true)}
          className="bg-[#b89b6e] hover:bg-[#a1845e] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition"
        >
          Logga ut
        </button>

        {/* SAVED BUILDS */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-[#6e502e] mb-4">
            Dina sparade byggen
          </h2>

          {savedBuilds.length === 0 ? (
            <p className="text-sm text-[#7a5f39]">
              Du har inga sparade byggen ännu. Besök{" "}
              <a href="/build" className="text-[#b89b6e] font-medium hover:underline">
                byggsidan
              </a>{" "}
              för att spara några!
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {savedBuilds.map((build, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-[#fffaf3] border border-[#dbcbb4] rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 flex flex-col"
                >
                  <div className="flex-1">

                    <h3 className="text-[#3c2e1e] font-semibold text-base leading-snug">
                      {build.name || "Namnlöst bygge"}
                    </h3>

                    <div className="text-xs text-[#b89b6e] mt-1 font-medium">
                      {build.price ? build.price + " kr" : "Pris ej tillgängligt"}
                    </div>

                    <div className="text-[11px] text-[#6e502e] mt-3 space-y-1">
                      {build.cpu && <p>CPU: {build.cpu}</p>}
                      {build.gpu && <p>GPU: {build.gpu}</p>}
                      {build.ram && <p>RAM: {build.ram} GB</p>}
                    </div>

                    {build.description && (
                      <p className="text-[11px] text-[#7a5f39] mt-3 line-clamp-3">
                        {build.description}
                      </p>
                    )}

                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <button
                      onClick={() => removeBuild(index)}
                      className="text-[#a94b4b] hover:text-[#d05f5f] transition"
                    >
                      🗑 Ta bort
                    </button>

                    <button
                      onClick={() =>
                        alert("Kommer snart: exportera eller dela bygg 👀")
                      }
                      className="text-[#b89b6e] hover:text-[#a1845e] transition font-medium"
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

      {/* LOGOUT CONFIRM MODAL */}
      <AnimatePresence>
        {showConfirmLogout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 bg-opacity-70 backdrop-blur-sm z-40"
              onClick={() => setShowConfirmLogout(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fffaf3] text-[#3c2e1e] rounded-3xl shadow-2xl border border-[#dbcbb4] w-[90%] max-w-sm z-50 p-8"
            >
              <h3 className="text-lg font-semibold text-[#3c2e1e] mb-3">
                Logga ut?
              </h3>

              <p className="text-sm text-[#7a5f39] mb-6">
                Är du säker på att du vill logga ut från ditt konto?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="text-[#7a5f39] hover:text-[#6e502e] text-sm"
                >
                  Avbryt
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-[#b89b6e] hover:bg-[#a1845e] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition"
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
