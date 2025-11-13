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
    <main className="min-h-screen flex items-center justify-center bg-[#f4ede3] text-[#3c2e1e] px-4">

      {/* CARD */}
      <div className="bg-[#f9f4ec] text-[#3c2e1e] p-8 rounded-2xl shadow-xl w-full max-w-lg border border-[#dbcbb4]">

        <h1 className="text-2xl font-bold mb-4 text-center text-[#6e502e]">
          Bygg din dator
        </h1>

        <p className="text-center text-[#7a5f39] mb-6">
          Gör din upplevelse personlig – svara på några snabba frågor.
        </p>

        <label className="flex items-center gap-2 mb-6 text-[#6e502e] bg-[#f1e7d7] p-2 rounded-lg border border-[#dbcbb4]">
          <input
            type="checkbox"
            checked={iDontKnow}
            onChange={(e) => setIDontKnow(e.target.checked)}
          />
          <span className="text-sm">Jag vet inte / låt AI välja åt mig</span>
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

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">

                  <label className="block">
                    <span className="text-sm font-semibold text-[#6e502e]">
                      Vad ska datorn användas till?
                    </span>
                    <select
                      value={form.purpose}
                      onChange={(e) =>
                        setForm({ ...form, purpose: e.target.value })
                      }
                      className="w-full border border-[#dbcbb4] rounded-lg px-3 py-2 mt-1 bg-[#fffaf3] text-sm focus:outline-none focus:border-[#b89b6e]"
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
                    <span className="text-sm font-semibold text-[#6e502e]">
                      Din budget (kr)
                    </span>
                    <input
                      type="number"
                      placeholder="Ex: 15000"
                      value={form.budget}
                      onChange={(e) =>
                        setForm({ ...form, budget: e.target.value })
                      }
                      className="w-full border border-[#dbcbb4] rounded-lg px-3 py-2 mt-1 bg-[#fffaf3] text-sm focus:outline-none focus:border-[#b89b6e]"
                    />
                  </label>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <span className="text-sm font-semibold text-[#6e502e]">
                    Vilka märken gillar du?
                  </span>

                  <div className="flex flex-wrap gap-3 mt-2">
                    {brandsList.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 bg-[#f4ede3] border border-[#dbcbb4] px-3 py-1 rounded-lg text-sm text-[#6e502e]"
                      >
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

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">

                  <label className="block">
                    <span className="text-sm font-semibold text-[#6e502e]">
                      Föredrar du Intel eller AMD?
                    </span>
                    <select
                      value={form.cpuBrand}
                      onChange={(e) =>
                        setForm({ ...form, cpuBrand: e.target.value })
                      }
                      className="w-full border border-[#dbcbb4] rounded-lg px-3 py-2 mt-1 bg-[#fffaf3] text-sm focus:outline-none focus:border-[#b89b6e]"
                    >
                      <option value="">Välj...</option>
                      <option value="intel">Intel</option>
                      <option value="amd">AMD</option>
                      <option value="vet inte">Vet inte</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-[#6e502e]">
                      Spelar du några specifika spel?
                    </span>
                    <input
                      type="text"
                      placeholder="CS2, Fortnite... (valfritt)"
                      value={form.games}
                      onChange={(e) =>
                        setForm({ ...form, games: e.target.value })
                      }
                      className="w-full border border-[#dbcbb4] rounded-lg px-3 py-2 mt-1 bg-[#fffaf3] text-sm focus:outline-none focus:border-[#b89b6e]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-[#6e502e]">
                      Vill du ha RGB och design eller bara prestanda?
                    </span>
                    <select
                      value={form.design}
                      onChange={(e) =>
                        setForm({ ...form, design: e.target.value })
                      }
                      className="w-full border border-[#dbcbb4] rounded-lg px-3 py-2 mt-1 bg-[#fffaf3] text-sm focus:outline-none focus:border-[#b89b6e]"
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

        {/* BUTTONS */}
        <div className="flex justify-between mt-8">

          {step > 1 && !iDontKnow && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-lg border border-[#cdbba5] text-[#6e502e] bg-[#f4ede3] hover:bg-[#ebdfcb]"
            >
              Tillbaka
            </button>
          )}

          {step < 3 && !iDontKnow && (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="ml-auto px-4 py-2 rounded-lg bg-[#b89b6e] text-white hover:bg-[#a1845e]"
            >
              Nästa
            </button>
          )}

          {(step === 3 || iDontKnow) && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-auto px-4 py-2 rounded-lg bg-[#b89b6e] text-white hover:bg-[#a1845e] disabled:opacity-50"
            >
              {loading ? "Genererar..." : "Visa datorförslag"}
            </button>
          )}

        </div>
      </div>

    </main>
  );
}
