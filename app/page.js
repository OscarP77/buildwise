"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

// --- Textloop vänster ---
const texts = [
  "Bygg din drömdator med Erik 🔆",
  "Låt AI hjälpa dig välja rätt komponenter 💡",
  "Spara pengar med smartare val ⚙️",
  "Allt du behöver — i ett verktyg 🔍",
];

// --- Relevanta nyckelord ---
const relevantKeywords = [
  "dator",
  "pc",
  "processor",
  "cpu",
  "gpu",
  "grafikkort",
  "ram",
  "minne",
  "ssd",
  "moderkort",
  "kylning",
  "psu",
  "nätaggregat",
  "bygga",
  "uppgradera",
  "spel",
  "fps",
];

export default function Home() {
  // --- Inloggning ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = window.localStorage.getItem("bw_session");
    setIsLoggedIn(!!session);
  }, []);

  // --- Popup states ---
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPartners, setShowPartners] = useState(false);
  const [formSent, setFormSent] = useState(false);

  // ✅ Beta-popup state
  const [showBetaPopup, setShowBetaPopup] = useState(true);

  // Kontaktformulär state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState("");

  // --- Chat state ---
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  // --- UI state ---
  const [offsetY, setOffsetY] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const ticking = useRef(false);

  // --- Textrotation ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Parallax ---
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setOffsetY(window.scrollY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Första meddelande ---
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hej! Jag är Erik 👋\n\n" +
          "Jag hjälper dig att uppgradera din dator – mer FPS, bättre flyt och rätt delar för pengarna 🔧🚀\n\n" +
          "Berätta kort vad du har idag (t.ex. CPU/grafikkort eller bara 'gammal gamingdator')\n" +
          "och vad du vill förbättra (t.ex. CS2, Fortnite, redigering, streaming).",
      },
    ]);
  }, []);

  // --- Highlight komponentord ---
  const highlightComponents = (text) => {
    const parts = text.split(
      /(\b(?:cpu|gpu|ram|minne|ssd|moderkort|chassi|psu|grafikkort|kylning)\b)/gi
    );
    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      if (["cpu", "gpu", "ram", "ssd"].includes(lower)) {
        return (
          <span key={i} className="font-bold text-[#f97316]">
            {part}
          </span>
        );
      } else if (
        ["moderkort", "chassi", "psu", "grafikkort", "kylning"].includes(lower)
      ) {
        return (
          <span key={i} className="font-bold text-[#f59e0b]">
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  // --- Relevansfilter ---
  const isRelevant = (text) => {
    const lower = text.toLowerCase();
    return relevantKeywords.some((word) => lower.includes(word));
  };

  // --- Skicka meddelande ---
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (!isRelevant(messageText)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Jag kan tyvärr bara hjälpa till med datorrelaterade frågor just nu 💻",
        },
      ]);
      return;
    }

    setLoading(true);
    setStarted(true);

    try {
      const lowerMsg = messageText.toLowerCase();
      const priceMatch = lowerMsg.match(
        /(rtx\s*\d{3,4}|rx\s*\d{3,4}|i[3579]-?\d{4,5}k?|ryzen\s*\d\s*\d{3,4})/i
      );

      // Prisfrågor – API
      if (lowerMsg.includes("pris") || lowerMsg.includes("kostar")) {
        if (priceMatch) {
          const product = priceMatch[0].trim();
          try {
            const priceRes = await fetch(`/api/price-check`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: product }),
            });
            const priceData = await priceRes.json();

            if (priceData?.prices?.length) {
              const cheapest = priceData.prices[0];
              const highest = priceData.prices[priceData.prices.length - 1];

              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: `💰 ${product.toUpperCase()} hittades från ${cheapest.price} till ${highest.price} hos ${priceData.prices
                    .slice(0, 3)
                    .map((p) => p.store)
                    .join(", ")}`,
                },
              ]);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error("Prisfel:", err);
          }
        }
      }

      // Vanlig AI-chat
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();

      const cleanReply = data.reply
        .replace(/\n{2,}/g, "\n")
        .split("\n")
        .map((line, i) => (
          <p key={i} className="mb-3 leading-relaxed">
            {highlightComponents(line)}
          </p>
        ));

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: cleanReply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: (
            <p className="leading-relaxed">Något gick fel — försök igen.</p>
          ),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- Enter skickar ---
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // --- Popup-animationer ---
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const closeAllPopups = () => {
    setShowAbout(false);
    setShowContact(false);
    setShowPartners(false);
    setFormSent(false);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setContactError("");
    setContactSending(false);
  };

  // --- Kontaktformulär Submit ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError("");

    if (!contactName || !contactEmail || !contactMessage) {
      setContactError("Fyll i alla fält innan du skickar.");
      return;
    }

    setContactSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFormSent(true);
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      } else {
        setContactError(
          "Det gick inte att skicka meddelandet. Försök igen om en stund."
        );
      }
    } catch (err) {
      console.error("Kontaktformular-fel:", err);
      setContactError(
        "Tekniskt fel uppstod. Testa igen senare eller maila oss direkt."
      );
    } finally {
      setContactSending(false);
    }
  };

  return (
    <main
      className={`${inter.className} min-h-screen text-[#1e1e24] flex flex-col items-center p-4 relative overflow-x-hidden`}
      style={{ background: "#ffffff" }}
    >
      {/* --- Bakgrund --- */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 will-change-transform"
        style={{
          transform: `translate3d(0, ${offsetY * 0.15}px, 0)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <Image
          src="/circuit-bg.png"
          alt=""
          fill
          className="object-cover"
          style={{
            opacity: 0.06,
            filter: "grayscale(80%) contrast(90%) brightness(102%)",
          }}
          priority
        />
      </div>

      {/* --- Rörlig text vänster --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={texts[currentTextIndex]}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 1 }}
          className="fixed left-[6%] top-1/2 -translate-y-1/2 text-[#555] text-2xl md:text-3xl font-semibold max-w-[320px] pointer-events-none z-0 select-none"
          style={{
            lineHeight: 1.5,
            textShadow: "0 0 5px rgba(249, 115, 22, 0.25)",
          }}
        >
          {texts[currentTextIndex]}
        </motion.div>
      </AnimatePresence>

      {/* --- Header --- */}
      <header className="fixed top-1 left-0 right-0 z-50">
        <div
          className="w-full flex items-center justify-between px-6 h-16 border-b border-[#fcd34d]"
          style={{
            background: "#fef3c7",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 20px rgba(249, 115, 22, 0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 relative rounded-xl overflow-hidden drop-shadow-[0_0_10px_rgba(249,115,22,0.4)] ml-2.5">
              <Image
                src="/logga.png"
                alt="BuildWise logotyp"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[#1e1e24] text-2xl font-bold leading-tight">
                BuildWise
              </h1>
              <span className="text-[13px] text-[#f97316] hidden sm:inline">
                AI-rådgivning för datorbygge
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setShowAbout(true)}
              className="text-[#333] hover:text-[#f59e0b] transition"
            >
              Om oss
            </button>

            <button
              onClick={() => setShowContact(true)}
              className="text-[#333] hover:text-[#f59e0b] transition"
            >
              Kontakt
            </button>

            <button
              onClick={() => setShowPartners(true)}
              className="text-[#333] hover:text-[#f59e0b] transition"
            >
              Partners
            </button>

            <Link
              href="/blogg"
              className="text-[#333] hover:text-[#f59e0b] transition"
            >
              Blogg
            </Link>

            {isLoggedIn ? (
              <a
                href="/konto"
                className="px-4 py-2 bg-linear-to-r from-[#f59e0b] to-[#f97316] hover:from-[#f97316] hover:to-[#ea580c] text-white rounded-xl font-semibold transition shadow-[0_0_15px_rgba(249,115,22,0.25)]"
              >
                Min sida
              </a>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 bg-linear-to-r from-[#f59e0b] to-[#f97316] hover:from-[#f97316] hover:to-[#ea580c] text-white rounded-xl font-semibold transition shadow-[0_0_15px_rgba(249,115,22,0.25)]"
              >
                Logga in
              </a>
            )}
          </nav>

          <div className="md:hidden text-[#333]">
            <button
              onClick={() => setShowAbout(true)}
              className="hover:text-[#f59e0b] transition"
            >
              Meny
            </button>
          </div>
        </div>
      </header>

      {/* Spacer för header */}
      <div style={{ height: 64 }} />

      {/* --- Hero Sektion med knappar --- */}
      <section className="relative flex flex-col items-center justify-center flex-1 text-center mt-8">
        <div className="w-[480px] max-w-[90%] rounded-3xl shadow-[0_8px_25px_rgba(249,115,22,0.15)] overflow-hidden relative">
          <Image
            src="/hero-sandstonev2.png"
            alt="BuildWise – AI som hjälper dig bygga dator"
            width={960}
            height={640}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/build-setup"
            className="px-6 py-3 bg-linear-to-r from-[#f59e0b] to-[#f97316] hover:from-[#f97316] hover:to-[#ea580c] text-white rounded-xl font-semibold transition shadow-[0_0_20px_rgba(249,115,22,0.2)]"
          >
            Bygg din dator
          </Link>

          <button
            onClick={() => {
              setStarted(true);
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
            }}
            className="px-6 py-3 bg-linear-to-r from-[#f59e0b] to-[#f97316] hover:from-[#f97316] hover:to-[#ea580c] text-white rounded-xl font-semibold transition shadow-[0_0_20px_rgba(249,115,22,0.2)]"
          >
            Uppgradera dator
          </button>

          <Link
            href="/build-ai"
            className="px-6 py-3 bg-linear-to-r from-[#f59e0b] via-[#f97316] to-[#fb923c] hover:from-[#f97316] hover:to-[#ea580c] text-white rounded-xl font-semibold shadow-[0_0_25px_rgba(249,115,22,0.3)] transition"
          >
            Skapa din dator
          </Link>
        </div>
      </section>

      {/* --- Chat (visas när started === true) --- */}
      {started && (
        <section className="flex flex-col items-center w-full flex-1 mt-4 mb-10 px-4">
          <div className="w-full max-w-4xl">
            <motion.div
              id="start"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#fff9f2] border border-[#fde68a] rounded-t-3xl p-5 text-center shadow-[0_4px_15px_rgba(249,115,22,0.1)]"
            >
              <h2 className="text-3xl font-bold mb-2 text-[#1e1e24]">
                Få hjälp med uppgradering direkt av Erik ☀️
              </h2>
              <p className="text-[#4f4f57] max-w-2xl mx-auto text-sm">
                Beskriv din nuvarande dator och vad du vill förbättra – Erik hjälper dig
                att välja rätt uppgraderingar.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#ffffff] border border-[#fde68a] border-t-0 p-6 rounded-b-3xl shadow-[0_12px_40px_rgba(249,115,22,0.08)] flex flex-col justify-between"
              style={{ height: "65vh" }}
            >
              {/* Meddelanden */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-1">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl max-w-[75%] leading-relaxed ${
                          msg.role === "user"
                            ? "bg-linear-to-r from-[#f59e0b] to-[#f97316] text-white self-end"
                            : "bg-[#fff7ed] text-[#1e1e24] border border-[#fde68a]"
                        } shadow-sm`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="flex items-start gap-2">
                            <span className="text-xl">🤖</span>
                            <div className="flex flex-col">{msg.content}</div>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <div className="flex justify-start items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#f59e0b] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#f59e0b] rounded-full animate-bounce [animation-delay:-.2s]"></div>
                      <div className="w-2 h-2 bg-[#f59e0b] rounded-full animate-bounce [animation-delay:-.4s]"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Inputfält */}
              <div className="flex gap-2 mt-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: 'Jag har Ryzen 5 3600 och GTX 1060 och vill ha mer FPS i CS2'"
                  rows="1"
                  className="flex-1 p-3 bg-white border border-[#fcd34d] rounded-xl text-[#1e1e24] placeholder-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/40 resize-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="px-5 py-3 bg-linear-to-r from-[#f59e0b] to-[#f97316] hover:from-[#f97316] hover:to-[#ea580c] text-white rounded-xl font-semibold border border-[#fcd34d] transition shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                >
                  Skicka
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* --- Info-sektionerna längst ner --- */}
      <div className="w-full max-w-4xl mt-12 space-y-8">
        {[
          {
            id: "kompatibilitet",
            title: "Kompatibilitetskontroll",
            text: "Osäker på om dina komponenter passar ihop? Snart kan du mata in dina delar och få en AI-kontroll som verifierar kompatibilitet mellan CPU, moderkort, RAM och GPU – så du slipper gissa.",
          },
          {
            id: "om-oss",
            title: "Om oss",
            text: "BuildWise kombinerar AI med expertkunskap för att göra datorbygge enkelt, roligt och tryggt. Vi tror att alla ska kunna bygga sin drömdator – utan att oroa sig för felköp.",
          },
          {
            id: "kontakt",
            title: "Kontakt",
            text: "Har du frågor, feedback eller vill samarbeta? Hör av dig till oss på info@buildwise.se.",
          },
        ].map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="bg-[#fffaf2] text-[#1e1e24] border border-[#fde68a] rounded-3xl p-8 shadow-[0_4px_15px_rgba(249,115,22,0.08)]"
          >
            <h3 className="text-2xl font-bold mb-3 text-[#ea580c]">
              {section.title}
            </h3>
            <p className="text-[#4f4f57]/90">{section.text}</p>
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-[#a1a1aa] pb-8">
        © {new Date().getFullYear()} BuildWise ☀️ Alla rättigheter förbehållna.
      </footer>

      {/* ✅ BETA-POPUP */}
      {showBetaPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#f9f4ec] border border-[#dbcbb4] shadow-2xl p-5">
            <h2 className="text-lg font-semibold text-[#3c2e1e] mb-2">
              BuildWise är i beta 🚧
            </h2>
            <p className="text-sm text-[#5b4226] mb-3">
              Vi är mitt i vår beta-lansering och finslipar fortfarande tjänsten.
              Om du märker något som inte fungerar som det ska, eller har idéer
              på förbättringar, får du jättegärna höra av dig 🙏
            </p>
            <p className="text-xs text-[#7a5f39] mb-4">
              Kontakt: <span className="font-medium">info@buildwise.se</span>
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowBetaPopup(false)}
                className="px-4 py-2 text-sm rounded-lg border border-[#cdbba5] bg-white hover:bg-[#f4ede3] text-[#3c2e1e]"
              >
                Okej, jag fattar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Popups (Om oss / Kontakt / Partners) --- */}
      <AnimatePresence>
        {(showAbout || showContact || showPartners) && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="bg-[#ffffff] text-[#1e1e24] rounded-3xl shadow-2xl w-full max-w-lg p-8 relative border border-[#fde68a]"
            >
              {/* Stäng-knapp */}
              <button
                onClick={closeAllPopups}
                className="absolute top-4 right-4 text-[#f59e0b] hover:text-[#ea580c] text-xl"
              >
                ✕
              </button>

              {/* --- OM OSS POPUP --- */}
              {showAbout && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-[#f97316]">
                    Om oss
                  </h2>
                  <p className="text-[#3a3a40] leading-relaxed">
                    BuildWise startades av <strong>Oscar Petersson</strong> och{" "}
                    <strong>Victor Rosengren</strong>. Idén kom när Oscar försökte
                    uppgradera sin egen dator och Victor ville köpa en ny men inte visste
                    var han skulle börja.
                  </p>
                  <p className="text-[#3a3a40] leading-relaxed mt-4">
                    Vi bygger AI-verktyg som gör datorbygge enklare och tryggare – utan
                    felköp och onödiga kostnader.
                  </p>
                  <p className="text-[#4f4f57]/80 italic mt-4">
                    Det började som ett litet projekt mellan två vänner — nu förändrar vi
                    hur folk bygger datorer 💻
                  </p>
                </>
              )}

              {/* --- KONTAKT POPUP --- */}
              {showContact && (
                <>
                  {!formSent ? (
                    <>
                      <h2 className="text-2xl font-bold mb-4 text-[#f97316]">
                        Kontakt
                      </h2>
                      <p className="text-[#3a3a40] mb-4">
                        Har du frågor? Skriv till oss här 👇
                      </p>

                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <input
                          type="text"
                          placeholder="Namn"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#fffaf2] border border-[#fde68a]"
                        />
                        <input
                          type="email"
                          placeholder="E-post"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#fffaf2] border border-[#fde68a]"
                        />
                        <textarea
                          rows="4"
                          placeholder="Meddelande..."
                          required
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#fffaf2] border border-[#fde68a]"
                        />

                        {contactError && (
                          <p className="text-red-500 text-sm">{contactError}</p>
                        )}

                        <button
                          type="submit"
                          disabled={contactSending}
                          className="w-full px-6 py-3 bg-linear-to-r from-[#f59e0b] to-[#f97316] text-white rounded-xl font-semibold disabled:opacity-60 shadow"
                        >
                          {contactSending ? "Skickar..." : "Skicka"}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-3 text-[#f97316]">
                        Tack! ☀️
                      </h2>
                      <p className="text-[#3a3a40]">
                        Ditt meddelande är skickat. Vi hör av oss snart!
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* --- PARTNERS POPUP --- */}
              {showPartners && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-[#f97316] text-center">
                    Partners
                  </h2>
                  <ul className="space-y-2 text-center text-lg text-[#3a3a40]">
                    <li>💻 Elgiganten</li>
                    <li>🖥️ Komplett</li>
                    <li>🎮 Webhallen</li>
                    <li>⚙️ Inet</li>
                  </ul>
                  <p className="text-[#4f4f57]/80 text-sm mt-4 text-center">
                    Vi arbetar på fler samarbeten för att kunna visa bättre priser &
                    rekommendationer direkt i Erik-chatten.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
