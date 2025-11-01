import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { build, purpose } = await req.json();
  const mockMode = process.env.MOCK_MODE !== "false";

  if (mockMode) {
    const examples = [
      "Balanserad dator med stark CPU och effektiv kylning — utmärkt för långvarig belastning.",
      "Kraftfull kombination av RTX-grafik och snabb DDR5-minne, idealisk för 1440p-spel och multitasking.",
      "Energieffektiv konfiguration med låg ljudnivå och stabil prestanda i produktivitetsapplikationer.",
      "Optimerad för gaming med höga FPS och minimala temperaturtoppar under belastning.",
      "Robust allround-dator med snabba laddningstider och solid luftflödesdesign.",
    ];
    const description = examples[Math.floor(Math.random() * examples.length)];
    return NextResponse.json({ description });
  }

  const prompt = `Beskriv tekniskt och detaljerat datorbygget nedan på svenska. Fokusera på hur komponenterna samverkar, prestanda, kylning och användningsområde. Använd 1–2 meningar. Datorns syfte är "${purpose}". Komponenter:\n${JSON.stringify(build.components, null, 2)}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Du är en teknisk datorbyggnadsexpert som skriver korta men detaljerade beskrivningar på svenska." },
        { role: "user", content: prompt },
      ],
    });
    const text = completion.choices[0].message.content.trim();
    return NextResponse.json({ description: text });
  } catch (err) {
    console.error("❌ Fel vid AI-beskrivning:", err);
    return NextResponse.json({ description: "Teknisk beskrivning kunde inte genereras." });
  }
}
