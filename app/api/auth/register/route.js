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

function writeUsers(users) {
  const filePath = getUsersFilePath();
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
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

    const exists = users.find((u) => u.email === email);
    if (exists) {
      return NextResponse.json(
        { ok: false, message: "Det finns redan ett konto med den e-posten." },
        { status: 409 }
      );
    }

    users.push({ email, password });
    writeUsers(users);

    return NextResponse.json(
      { ok: true, message: "Konto skapat.", email },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { ok: false, message: "Serverfel vid registrering." },
      { status: 500 }
    );
  }
}
