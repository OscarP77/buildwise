"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Om redan inloggad -> hem
  useEffect(() => {
    const session = window.localStorage.getItem("bw_session");
    if (session === "true") {
      router.push("/");
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.message || "Något gick fel.");
        setLoading(false);
        return;
      }

      window.localStorage.setItem("bw_session", "true");
      window.localStorage.setItem("bw_email", data.email || email);

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Serverfel. Försök igen.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4ede3] text-[#3c2e1e] px-4">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-[#fffaf3] border border-[#dbcbb4] rounded-2xl shadow-xl w-full max-w-sm p-10"
      >
        <h1 className="text-3xl font-semibold text-center text-[#6e502e]">
          Logga in
        </h1>

        <p className="text-sm text-center text-[#7a5f39] mt-2 mb-8">
          Fortsätt till ditt BuildWise-konto
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm font-medium text-[#6e502e] block mb-1">
              E-post
            </label>
            <input
              type="email"
              required
              className="w-full border border-[#cdbba5] rounded-xl px-3 py-2 text-sm bg-[#fffdf8] outline-none focus:ring-2 focus:ring-[#b89b6e]"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#6e502e] block mb-1">
              Lösenord
            </label>
            <input
              type="password"
              required
              className="w-full border border-[#cdbba5] rounded-xl px-3 py-2 text-sm bg-[#fffdf8] outline-none focus:ring-2 focus:ring-[#b89b6e]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-[#fbe9e9] text-[#a33a3a] text-sm rounded-lg px-3 py-2 border border-[#e4b4b4]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#b89b6e] hover:bg-[#a1845e] transition text-white font-semibold rounded-xl px-4 py-2 text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <p className="text-center text-xs text-[#7a5f39] mt-6">
          Har du inget konto?{" "}
          <button
            className="text-[#b89b6e] hover:underline font-medium"
            onClick={() => router.push("/register")}
          >
            Skapa konto
          </button>
        </p>
      </motion.div>

    </main>
  );
}
