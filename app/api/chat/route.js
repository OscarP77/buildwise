import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const data = await req.json();
  const userMessage = data.message;

  // SYSTEMINSTRUKTION till Erik
  const systemPrompt = `
  Du är Erik, rådgivare på BuildWise. 
  Du hjälper kunder att:
  - Bygga nya datorer (komponenter, prestanda, kompatibilitet)
  - Uppgradera befintliga datorer
  - Ge råd om grafikkort, processorer, RAM, kylning och budgetval

  Du får ENDAST svara på frågor som handlar om datorer, datorkomponenter, prestanda, budget, optimering eller relaterad teknik.
  Om användaren frågar något som inte handlar om datorer eller uppgiften ovan ska du svara:
  "Jag kan tyvärr bara hjälpa till med datorrelaterade frågor just nu 💻"
  Använd alltid ett vänligt och professionellt språk på svenska.
  Håll svaren tydliga, korta och konkreta.
  `;

  // Skicka till OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const reply = completion.choices[0].message.content;
  return NextResponse.json({ reply });
}
