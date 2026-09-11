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

    const pathname = `saves/${saveId}.json`;

    console.log("=== LECTURE BLOB ===");
    console.log("pathname :", pathname);

    const result = await get(pathname, {
      access: "private",
      useCache: false,
    });

    console.log("result :", result);

    if (!result) {
      return NextResponse.json(
        { error: "Aucune sauvegarde" },
        { status: 404 }
      );
    }

    const response = new Response(result.stream);
    const text = await response.text();

    console.log("contenu Blob reçu :", text.length, "caractères");

    const save = JSON.parse(text);

    return NextResponse.json({
      save,
    });
  } catch (error) {
    console.error("ERREUR GET BLOB :", error);

    return NextResponse.json(
      {
        error: "Impossible de lire la sauvegarde",
        details: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
