const LOCAL_KEY = "grand-line-tactics-save";
const SAVE_ID_KEY = "grand-line-tactics-save-id";

function getSaveId() {
  if (typeof window === "undefined") return null;
  let id = window.localStorage.getItem(SAVE_ID_KEY);
  if (!id) {
    id = `local-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    window.localStorage.setItem(SAVE_ID_KEY, id);
  }
  return id;
}

function saveLocal(state) {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}

function loadLocal() {
  const raw = window.localStorage.getItem(LOCAL_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveGame(state) {
  const saveId = getSaveId();
  const payload = { saveId, ...state };

  // Sauvegarde locale systématique (rapide, toujours dispo hors-ligne)
  saveLocal(payload);

  // Tentative de sauvegarde distante (Neon) si l'API est configurée
  try {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.info("Sauvegarde distante indisponible, sauvegarde locale utilisée.");
    }
  } catch (err) {
    console.info("Pas de connexion à la base distante, sauvegarde locale utilisée.");
  }

  return payload;
}

export async function loadGame() {
  const saveId = getSaveId();

  try {
    const res = await fetch(`/api/save?saveId=${encodeURIComponent(saveId)}`);
    if (res.ok) {
      const data = await res.json();
      return data.save;
    }
  } catch (err) {
    // pas de réseau / pas d'API : on continue vers le fallback local
  }

  return loadLocal();
}
