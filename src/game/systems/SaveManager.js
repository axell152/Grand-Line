const LOCAL_KEY = "grand-line-tactics-save";

// Identifiant stable de ta sauvegarde.
// Il ne change pas lors d'un nouveau déploiement Vercel.
const SAVE_ID = "grand-line-tactics-main-save";

function getSaveId() {
  return SAVE_ID;
}

function saveLocal(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}

function loadLocal() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(LOCAL_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveGame(state) {
  const saveId = getSaveId();

  const payload = {
    saveId,
    ...state,
  };

  // Sauvegarde locale immédiate
  saveLocal(payload);

  // Sauvegarde Vercel Blob
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
        // On met également à jour la sauvegarde locale
        saveLocal(data.save);
        return data.save;
      }
    }
  } catch (err) {
    console.info("Impossible de charger la sauvegarde Blob.");
  }

  // Fallback local
  return loadLocal();
}
