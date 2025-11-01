import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req) {
  // --- Säker inläsning av request-body ---
  let purpose = "okänt syfte";
  let budget = 0;

  try {
    const body = await req.json();
    purpose = body?.purpose || purpose;
    budget = body?.budget || budget;
  } catch {
    console.warn("⚠️ Ingen JSON-body skickades – kör defaultvärden.");
  }

  const mockMode = process.env.MOCK_MODE !== "false";

  console.log("📩 Byggförslag mottaget:", { purpose, budget, mockMode });

  // --- Rensa & normalisera budget ---
  const cleanBudget = Number(String(budget || "").replace(/\s+/g, "")) || 0;

  // --- MOCK MODE ---
  if (mockMode || !process.env.OPENAI_API_KEY) {
    const mockBuilds = Array.from({ length: 8 }).map((_, i) => ({
      name: `Datorpaket ${i + 1}`,
      price: `${(cleanBudget * (0.8 + Math.random() * 0.4) || 12000).toFixed(0)} kr`,
      cpu: "AMD Ryzen 5 7600",
      gpu: "NVIDIA RTX 4060",
      ram: 32,
      storage: "1 TB NVMe SSD",
      motherboard: "MSI B650 Tomahawk",
      psu: "650 W Gold",
      case: "Fractal Design Pop Air",
      image: `/build${(i % 4) + 1}.jpg`,
      description: "Ett välbalanserat bygge för gaming och vardagsbruk.",
    }));

    console.log("✅ Mockläge aktivt – skickar tillbaka", mockBuilds.length, "byggen.");
    return NextResponse.json({ builds: mockBuilds });
  }

  // --- OPENAI-PROMPT ---
  const prompt = `
  Skapa 8 datorbyggen på svenska för syftet "${purpose}" med budget ca ${budget} kr.
  Inkludera komponenter: Processor, Grafikkort, RAM, Lagring, Moderkort, Nätaggregat, Chassi och en totalpris.
  Returnera i JSON-format, t.ex.:
  {
    "builds": [
      {
        "name": "Budget Gaming PC",
        "price": "12000 kr",
        "Processor": "AMD Ryzen 5 7600",
        "Grafikkort": "RTX 4060",
        "RAM": "32 GB",
        "Lagring": "1 TB SSD",
        "Moderkort": "MSI B650",
        "Nätaggregat": "650 W Gold",
        "Chassi": "Fractal Design Pop Air",
        "description": "Prisvärd och balanserad dator för 1080p gaming."
      }
    ]
  }`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Du är en datorbyggnadsexpert som alltid svarar i giltig JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    const rawBuilds = parsed.builds || parsed;

    // --- Anpassa till frontenden ---
    const builds = rawBuilds.map((b, i) => ({
      name: b.name || `Bygge ${i + 1}`,
      price: b.price || "okänt pris",
      cpu: b.Processor || b.cpu || "Okänd CPU",
      gpu: b.Grafikkort || b.gpu || "Okänt grafikkort",
      ram: parseInt(b.RAM) || 16,
      storage: b.Lagring || b.storage || "1 TB SSD",
      motherboard: b.Moderkort || b.motherboard || "MSI B650",
      psu: b["Nätaggregat"] || b.psu || "650 W Bronze",
      case: b.Chassi || b.case || "Fractal Design Pop Air",
      image: `/build${(i % 4) + 1}.jpg`,
      description: b.description || "Ett välbalanserat bygge för gaming och vardag.",
    }));

    console.log("✅ AI-genererade datorer:", builds.length);
    return NextResponse.json({ builds });
  } catch (err) {
    console.error("❌ Fel vid AI-generering:", err);
    return NextResponse.json(
      { error: "Misslyckades att generera förslag." },
      { status: 500 }
    );
  }
}
