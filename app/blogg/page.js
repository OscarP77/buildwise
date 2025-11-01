"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BloggPage() {
  const posts = [
    {
      title: "Mitt första bygge – från idé till verklighet",
      author: "Oscar Petersson",
      date: "24 oktober 2025",
      content:
        "När jag och Victor startade BuildWise handlade allt om att förenkla vägen till rätt dator. Här delar jag mitt första riktiga bygge – vad jag lärde mig, vad jag skulle gjort annorlunda, och vilka delar som överraskade mest.",
    },
    {
      title: "Så väljer du rätt grafikkort för dina behov",
      author: "Erik (AI-assistenten)",
      date: "22 oktober 2025",
      content:
        "Alla pratar om FPS och benchmarks, men vad betyder det egentligen för dig? Här går jag igenom hur du väljer rätt GPU beroende på din budget och vilka spel du kör mest.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#1f1230] text-white py-16 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-10"
      >
        BuildWise Blogg
      </motion.h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {posts.map((post, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-[#2a1840] border border-purple-800 rounded-3xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-2 text-purple-300">
              {post.title}
            </h2>
            <p className="text-sm text-white/70 mb-4">
              {post.date} — {post.author}
            </p>
            <p className="text-white/90 leading-relaxed mb-6">{post.content}</p>
            <Link
              href="#"
              className="text-purple-400 hover:text-purple-300 font-semibold transition"
            >
              Läs mer →
            </Link>
          </motion.div>
        ))}
      </div>

      <footer className="mt-16 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} BuildWise Blogg – Inspirera, lär, bygg.
      </footer>
    </main>
  );
}
