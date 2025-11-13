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

    // --- SMTP för STRATO ---
    const transporter = nodemailer.createTransport({
      host: "smtp.strato.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,     // tex info@buildwise.se
        pass: process.env.EMAIL_PASSWORD, // det du satte i .env
      },
    });

    await transporter.sendMail({
      from: `"BuildWise Kontakt" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Skickas till dig
      subject: "Nytt kontaktformulär från BuildWise",
      text: `
Namn: ${name}
E-post: ${email}

Meddelande:
${message}
      `,
      replyTo: email, // så du kan svara direkt i Outlook
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
