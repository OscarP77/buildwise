export const runtime = "nodejs";  // <-- VIKTIGT

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

    // SMTP via STRATO
    const transporter = nodemailer.createTransport({
      host: "smtp.strato.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"BuildWise Kontakt" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Nytt kontaktformulär från BuildWise",
      text: `
Namn: ${name}
E-post: ${email}

Meddelande:
${message}
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
