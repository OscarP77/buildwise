"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

      // spara session lokalt
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
    <main className="min-h-screen flex items-center justify-center bg-linear-to-b from-black via-zinc-900 to-zinc-800 text-white px-4">
      <div className="bg-white text-black p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">Logga in</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Fortsätt till ditt BuildWise-konto
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              E-post
            </label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Lösenord
            </label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 active:bg-purple-900 transition-colors text-white font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Har du inget konto?{" "}
          <button
            className="text-purple-700 hover:underline font-medium"
            onClick={() => router.push("/register")}
          >
            Skapa konto
          </button>
        </p>
      </div>
    </main>
  );
}
