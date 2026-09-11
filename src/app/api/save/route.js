import { NextResponse } from "next/server";
import { put, get } from "@vercel/blob";

export const runtime = "nodejs";

const BLOB_PATH = "saves/grand-line-tactics-main-save.json";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body?.saveId) {
      return NextResponse.json(
        { error: "saveId manquant" },
        { status: 400 }
      );
    }

    const result = await put(
      BLOB_PATH,
      JSON.stringify(body),
      {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      }
    );

    console.log("BLOB SAUVEGARDE :", result);

    return NextResponse.json({
      success: true,
      saveId: body.saveId,
    });
  } catch (error) {
    console.error("Erreur sauvegarde Blob :", error);

    return NextResponse.json(
      {
        error: "Impossible de sauvegarder la partie",
        details: error?.message || "Erreur inconnue",
      },
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

    const result = await get(BLOB_PATH, {
      access: "private",
      useCache: false,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Aucune sauvegarde" },
        { status: 404 }
      );
    }

    const response = new Response(result.stream);
    const text = await response.text();
    const save = JSON.parse(text);

    return NextResponse.json({ save });
  } catch (error) {
    console.error("Erreur chargement Blob :", error);

    return NextResponse.json(
      {
        error: "Impossible de charger la sauvegarde",
        details: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
