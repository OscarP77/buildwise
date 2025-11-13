import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const data = await req.json();
    const messages = data.messages || [];

    const systemPrompt = `
Du är Erik – en vänlig, tydlig och kunnig PC-rådgivare på BuildWise.

✅ Du hjälper med:
- Uppgraderingar (grafikkort, processor, minne, lagring)
- Komponentjämförelser
- Rekommendationer baserat på budget
- Prestanda och flaskhalsar
- Att bygga datorer från grunden

✅ ALLA följdfrågor som är inom ämnet datorer ska besvaras.
Exempel:
"jag har rtx 3060" → datorrelaterat
"jag vill uppgradera" → datorrelaterat
"vilket kort är bäst?" → datorrelaterat

✅ Använd enklare ord:
- processor istället för CPU
- grafikkort istället för GPU
- minne istället för RAM

❌ Endast om frågan absolut INTE handlar om datorer ska du säga:
"Jag kan tyvärr bara hjälpa till med datorrelaterade frågor just nu 💻"

Svara på modern, tydlig svenska och var alltid hjälpsam.
    `;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: apiMessages,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat Route Error:", err);
    return NextResponse.json(
      { reply: "Ett serverfel uppstod — försök igen om en liten stund 🙏" },
      { status: 500 }
    );
  }
}
