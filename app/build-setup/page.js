"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function BuildSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [iDontKnow, setIDontKnow] = useState(false);

  const [form, setForm] = useState({
    purpose: "",
    budget: "",
    brands: [],
    cpuBrand: "",
    games: "",
    design: "",
  });

  const brandsList = ["ASUS", "MSI", "Gigabyte", "Corsair", "NZXT"];

  function toggleBrand(brand) {
    setForm((prev) => {
      const updated = prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: updated };
    });
  }

  async function handleSubmit() {
    setLoading(true);
    const params = new URLSearchParams({
      purpose: form.purpose || "okänt",
      budget: form.budget || "0",
      brands: form.brands.join(",") || "alla",
      cpuBrand: form.cpuBrand || "okänt",
      design: form.design || "okänt",
      games: form.games || "",
      auto: iDontKnow ? "true" : "false",
    });
    router.push(`/build?${params.toString()}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-b from-black via-zinc-900 to-zinc-800 text-white px-4">
      <div className="bg-white text-black p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Bygg din dator</h1>
        <p className="text-center text-gray-600 mb-6">
          Gör din upplevelse personlig – svara på några snabba frågor.
        </p>

        <label className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            checked={iDontKnow}
            onChange={(e) => setIDontKnow(e.target.checked)}
          />
          <span>Jag vet inte / låt AI välja åt mig</span>
        </label>

        <AnimatePresence mode="wait">
          {!iDontKnow && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold">Vad ska datorn användas till?</span>
                    <select
                      value={form.purpose}
                      onChange={(e) =>
                        setForm({ ...form, purpose: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm"
                    >
                      <option value="">Välj...</option>
                      <option value="gaming">Gaming</option>
                      <option value="arbete">Arbete</option>
                      <option value="videoredigering">Videoredigering</option>
                      <option value="programmering">Programmering</option>
                      <option value="allt">Allt möjligt</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold">Din budget (kr)</span>
                    <input
                      type="number"
                      placeholder="Ex: 15000"
                      value={form.budget}
                      onChange={(e) =>
                        setForm({ ...form, budget: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm"
                    />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div>
                  <span className="text-sm font-semibold">Vilka märken gillar du?</span>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {brandsList.map((brand) => (
                      <label key={brand} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.brands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold">Föredrar du Intel eller AMD?</span>
                    <select
                      value={form.cpuBrand}
                      onChange={(e) =>
                        setForm({ ...form, cpuBrand: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm"
                    >
                      <option value="">Välj...</option>
                      <option value="intel">Intel</option>
                      <option value="amd">AMD</option>
                      <option value="vet inte">Vet inte</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold">Spelar du några specifika spel?</span>
                    <input
                      type="text"
                      placeholder="CS2, Fortnite... (valfritt)"
                      value={form.games}
                      onChange={(e) =>
                        setForm({ ...form, games: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold">
                      Vill du ha RGB och design eller bara prestanda?
                    </span>
                    <select
                      value={form.design}
                      onChange={(e) =>
                        setForm({ ...form, design: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm"
                    >
                      <option value="">Välj...</option>
                      <option value="rgb">RGB & estetik</option>
                      <option value="prestanda">Prestanda</option>
                      <option value="vet inte">Vet inte</option>
                    </select>
                  </label>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          {step > 1 && !iDontKnow && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              Tillbaka
            </button>
          )}

          {step < 3 && !iDontKnow && (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="ml-auto px-4 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800"
            >
              Nästa
            </button>
          )}

          {(step === 3 || iDontKnow) && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-auto px-4 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-50"
            >
              {loading ? "Genererar..." : "Visa datorförslag"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
