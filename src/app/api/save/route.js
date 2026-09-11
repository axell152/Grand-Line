import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export const runtime = "nodejs";

function getBlobPath(saveId) {
  return `saves/${saveId}.json`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { saveId } = body;

    if (!saveId) {
      return NextResponse.json(
        { error: "saveId manquant" },
        { status: 400 }
      );
    }

    await put(
      getBlobPath(saveId),
      JSON.stringify(body),
      {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
      }
    );

    return NextResponse.json({
      success: true,
      saveId,
    });
  } catch (error) {
    console.error("Erreur sauvegarde Blob :", error);

    return NextResponse.json(
      { error: "Impossible de sauvegarder la partie" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const saveId = new URL(request.url).searchParams.get("saveId");

    if (!saveId) {
      return NextResponse.json(
        { error: "saveId manquant" },
        { status: 400 }
      );
    }

    const path = getBlobPath(saveId);

    const result = await list({
      prefix: path,
      limit: 1,
    });

    const blob = result.blobs.find(
      (item) => item.pathname === path
    );

    if (!blob) {
      return NextResponse.json(
        { error: "Aucune sauvegarde" },
        { status: 404 }
      );
    }

    const response = await fetch(blob.url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Impossible de lire la sauvegarde" },
        { status: 500 }
      );
    }

    const save = await response.json();

    return NextResponse.json({ save });
  } catch (error) {
    console.error("Erreur chargement Blob :", error);

    return NextResponse.json(
      { error: "Impossible de charger la sauvegarde" },
      { status: 500 }
    );
  }
}
