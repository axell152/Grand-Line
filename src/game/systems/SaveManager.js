const LOCAL_KEY = "grand-line-tactics-save";
const SAVE_ID = "grand-line-tactics-main-save";
const SAVE_FORMAT = "GRAND-LINE-SAVE";
const SAVE_VERSION = 1;

function getSaveId() {
  return SAVE_ID;
}

function saveLocal(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}

function loadLocal() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Sauvegarde locale illisible :", error);
    return null;
  }
}

/**
 * Sauvegarde automatique : localStorage immédiatement, puis Blob si disponible.
 * Le fichier de sauvegarde exporté n'en dépend pas.
 */
export async function saveGame(state) {
  const saveId = getSaveId();

  const payload = {
    saveId,
    ...state,
  };

  saveLocal(payload);

  try {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.info("Sauvegarde Blob indisponible, sauvegarde locale conservée.");
    }
  } catch (err) {
    console.info("Impossible de joindre Vercel Blob, sauvegarde locale conservée.");
  }

  return payload;
}

export async function loadGame() {
  const saveId = getSaveId();

  if (!saveId) return loadLocal();

  try {
    const res = await fetch(
      `/api/save?saveId=${encodeURIComponent(saveId)}`
    );

    if (res.ok) {
      const data = await res.json();

      if (data.save) {
        saveLocal(data.save);
        return data.save;
      }
    }
  } catch (err) {
    console.info("Impossible de charger la sauvegarde Blob.");
  }

  return loadLocal();
}

/**
 * Télécharge la partie actuelle dans un fichier JSON.
 * Ce fichier est autonome : il ne dépend ni de Vercel, ni de Blob, ni du navigateur.
 */
export function downloadSaveFile(state) {
  if (typeof window === "undefined" || !state) return false;

  const fileData = {
    format: SAVE_FORMAT,
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    gameState: JSON.parse(JSON.stringify(state)),
  };

  const json = JSON.stringify(fileData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-") + "-" + [
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ].join("-");

  link.href = url;
  link.download = `grand-line-sauvegarde-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  // Conserve également une copie locale de sécurité.
  saveLocal({ ...state, saveId: getSaveId() });

  return true;
}

/**
 * Lit un fichier de sauvegarde téléchargé par le jeu.
 * Accepte aussi les anciennes sauvegardes JSON contenant directement l'état du jeu.
 */
export async function importSaveFile(file) {
  if (!file) throw new Error("Aucun fichier sélectionné.");

  const text = await file.text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error("Le fichier n'est pas un JSON valide.");
  }

  let state = null;

  if (parsed?.format === SAVE_FORMAT && parsed?.gameState) {
    if (parsed.version !== SAVE_VERSION) {
      throw new Error(`Version de sauvegarde incompatible (${parsed.version}).`);
    }
    state = parsed.gameState;
  } else if (parsed?.gameState && parsed?.format) {
    state = parsed.gameState;
  } else if (parsed?.islandId && Array.isArray(parsed.crew)) {
    // Compatibilité avec les anciennes sauvegardes exportées directement.
    state = parsed;
  }

  if (!state || typeof state !== "object") {
    throw new Error("Ce fichier ne contient pas une sauvegarde Grand Line valide.");
  }

  if (!state.islandId || typeof state.x !== "number" || typeof state.y !== "number") {
    throw new Error("La sauvegarde est incomplète ou corrompue.");
  }

  const cleanState = JSON.parse(JSON.stringify(state));
  saveLocal({ ...cleanState, saveId: getSaveId() });

  return cleanState;
}
