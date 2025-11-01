import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getUsersFilePath() {
  return path.join(process.cwd(), "users.json");
}

function readUsers() {
  const filePath = getUsersFilePath();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw || "[]");
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "E-post och lösenord krävs." },
        { status: 400 }
      );
    }

    const users = readUsers();
    const match = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!match) {
      return NextResponse.json(
        { ok: false, message: "Fel e-post eller lösenord." },
        { status: 401 }
      );
    }

    // Login OK
    return NextResponse.json(
      { ok: true, email },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { ok: false, message: "Serverfel vid inloggning." },
      { status: 500 }
    );
  }
}
