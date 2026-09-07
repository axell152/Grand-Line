import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const dbConfigured = () => Boolean(process.env.DATABASE_URL);

export async function GET(request) {
  if (!dbConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL non configurée" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const saveId = searchParams.get("saveId");
  if (!saveId) {
    return NextResponse.json({ error: "saveId manquant" }, { status: 400 });
  }

  const save = await prisma.saveGame.findUnique({ where: { saveId } });
  if (!save) {
    return NextResponse.json({ error: "Aucune sauvegarde" }, { status: 404 });
  }
  return NextResponse.json({ save });
}

export async function POST(request) {
  if (!dbConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL non configurée" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { saveId, islandId, x, y, crew, berrys, flags } = body;

  if (!saveId) {
    return NextResponse.json({ error: "saveId manquant" }, { status: 400 });
  }

  const save = await prisma.saveGame.upsert({
    where: { saveId },
    update: { islandId, x, y, crew, berrys, flags },
    create: { saveId, islandId, x, y, crew, berrys, flags },
  });

  return NextResponse.json({ save });
}
