import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// --- In-memory rate limit ---
const RATE_LIMIT = new Map();
const LIMIT_TIME = 1000 * 60 * 2; // 2 minuter mellan försök

export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "Unknown";

    const ua = req.headers.get("user-agent") || "Unknown";
    const referer = req.headers.get("referer") || "Unknown";

    const body = await req.json();
    const { name, email, message, honey, timeStarted } = body;

    // --- 1. Honeypot-botten check ---
    if (honey && honey.trim() !== "") {
      return NextResponse.json(
        { success: false, error: "Bot detected (honeypot filled)" },
        { status: 400 }
      );
    }

    // --- 2. Tid-check (bots skickar direkt) ---
    const now = Date.now();
    if (!timeStarted || now - timeStarted < 1200) {
      return NextResponse.json(
        { success: false, error: "Suspiciously fast submission" },
        { status: 400 }
      );
    }

    // --- 3. Rate-limit per IP ---
    const last = RATE_LIMIT.get(ip);
    if (last && now - last < LIMIT_TIME) {
      return NextResponse.json(
        { success: false, error: "Too many requests from this IP" },
        { status: 429 }
      );
    }
    RATE_LIMIT.set(ip, now);

    // --- 4. Blockera vanliga bot-fraser ---
    const botWords = ["viagra", "sex", "adult", "porn", "casino", "loan", "click here"];
    const msgLower = message.toLowerCase();
    if (botWords.some((w) => msgLower.includes(w))) {
      return NextResponse.json(
        { success: false, error: "Blocked due to spam keywords" },
        { status: 400 }
      );
    }

    // --- 5. Validering ---
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // --- 6. STRATO SMTP transporter ---
    const transporter = nodemailer.createTransport({
      host: "smtp.strato.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // --- 7. Skicka mail med extra info ---
    await transporter.sendMail({
      from: `"BuildWise Kontakt" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Nytt kontaktformulär från BuildWise",
      text: `
Ett nytt meddelande har skickats via formuläret.

--- AVSÄNDARE ---
Namn: ${name}
E-post: ${email}

--- MEDDELANDE ---
${message}

--- TEKNISK INFO ---
IP-adress: ${ip}
Enhet/Browser: ${ua}
Referer: ${referer}
Tidsåtgång för formuläret: ${(now - timeStarted) / 1000}s

      `,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("MAIL ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error while sending mail." },
      { status: 500 }
    );
  }
}
