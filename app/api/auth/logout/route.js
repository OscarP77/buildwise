import { NextResponse } from "next/server";

export async function POST() {
  // Ingen backend-session än. Frontend rensar localStorage.
  return NextResponse.json(
    { ok: true, message: "Utloggad." },
    { status: 200 }
  );
}
