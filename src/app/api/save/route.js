import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const dbConfigured = () => Boolean(process.env.DATABASE_URL);

export async function GET(request) {
  if (!dbConfigured()) return NextResponse.json({ error: "DATABASE_URL non configurée" }, { status: 503 });
  const saveId = new URL(request.url).searchParams.get("saveId");
  if (!saveId) return NextResponse.json({ error: "saveId manquant" }, { status: 400 });
  const save = await prisma.saveGame.findUnique({ where: { saveId } });
  if (!save) return NextResponse.json({ error: "Aucune sauvegarde" }, { status: 404 });

  const state = save.flags && typeof save.flags === "object" ? save.flags._state : null;
  return NextResponse.json({ save: state ? { ...save, ...state } : save });
}

export async function POST(request) {
  if (!dbConfigured()) return NextResponse.json({ error: "DATABASE_URL non configurée" }, { status: 503 });
  const body = await request.json();
  const { saveId, islandId, x, y, crew, berrys, flags, ...rest } = body;
  if (!saveId) return NextResponse.json({ error: "saveId manquant" }, { status: 400 });

  const persistedFlags = {
    ...(flags && typeof flags === "object" ? flags : {}),
    _state: { islandId, x, y, crew, berrys, ...rest },
  };

  const save = await prisma.saveGame.upsert({
    where: { saveId },
    update: { islandId, x, y, crew, berrys, flags: persistedFlags },
    create: { saveId, islandId, x, y, crew, berrys, flags: persistedFlags },
  });

  return NextResponse.json({ save: { ...save, ...rest, flags } });
}
