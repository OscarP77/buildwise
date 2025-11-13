import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // --- Hämta extra metadata för spam-skydd ---
    const headers = req.headers;

    const ip =
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headers.get("x-real-ip") ||
      "Unknown";

    const userAgent = headers.get("user-agent") || "Unknown device";

    const referer = headers.get("referer") || "No referer";

    const timestamp = new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
    });

    // --- SMTP STRATO ---
    const transporter = nodemailer.createTransport({
      host: "smtp.strato.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // --- MAIL SOM SKICKAS TILL DIG ---
    await transporter.sendMail({
      from: `"BuildWise Kontakt" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "📩 Ny kontaktförfrågan via BuildWise",
      text: `
En användare har skickat ett meddelande via kontaktformuläret:

──────────────
👤 Namn: ${name}
📧 E-post: ${email}
📅 Tid: ${timestamp}

💬 Meddelande:
${message}

──────────────
📌 TECHNICAL INFO (Anti-spam log):
IP-address: ${ip}
Device/User-Agent: ${userAgent}
Referer: ${referer}

──────────────
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
