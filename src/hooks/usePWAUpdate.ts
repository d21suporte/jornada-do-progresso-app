import { useCallback, useEffect, useRef, useState } from "react";

const VERSION_URL = "/version.json";
const POLL_MS = 5 * 60 * 1000; // 5 min
const STORAGE_KEY = "d21.app.version";

async function fetchRemoteVersion(): Promise<string | null> {
  try {
    const r = await fetch(`${VERSION_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) return null;
    const j = await r.json();
    return typeof j?.version === "string" ? j.version : null;
  } catch {
    return null;
  }
}

async function clearAppCaches() {
  // Limpa apenas Cache Storage do app — não toca em localStorage nem IndexedDB.
  try {
    if (typeof caches !== "undefined") {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    /* ignore */
  }
}

async function refreshServiceWorker(): Promise<boolean> {
  // Retorna true se um SW novo entrou em "waiting" (atualização encontrada).
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return false;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    if (regs.length === 0) return false;
    let foundWaiting = false;
    await Promise.all(
      regs.map(async (reg) => {
        try {
          await reg.update();
        } catch {
          /* ignore */
        }
        if (reg.waiting) {
          foundWaiting = true;
          try {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          } catch {
            /* ignore */
          }
        }
      }),
    );
    return foundWaiting;
  } catch {
    return false;
  }
}

function reloadWithBust() {
  const url = new URL(window.location.href);
  url.searchParams.set("_v", Date.now().toString());
  window.location.replace(url.toString());
}

export function usePWAUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [checking, setChecking] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const currentRef = useRef<string | null>(null);

  const check = useCallback(async (): Promise<boolean> => {
    setChecking(true);
    try {
      const remote = await fetchRemoteVersion();
      if (!remote) return false;
      setVersion(remote);
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      if (!stored) {
        try {
          localStorage.setItem(STORAGE_KEY, remote);
        } catch {
          /* ignore */
        }
        currentRef.current = remote;
        return false;
      }
      currentRef.current = stored;
      const has = stored !== remote;
      setNeedRefresh(has);
      return has;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void check();
    const i = setInterval(() => void check(), POLL_MS);
    const onFocus = () => void check();
    window.addEventListener("focus", onFocus);

    // Quando o novo SW assumir o controle, recarrega para aplicar a versão.
    let reloaded = false;
    const onControllerChange = () => {
      if (reloaded) return;
      reloaded = true;
      reloadWithBust();
    };
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    }

    return () => {
      clearInterval(i);
      window.removeEventListener("focus", onFocus);
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      }
    };
  }, [check]);

  const applyUpdate = useCallback(async () => {
    if (typeof window === "undefined") return;
    const remote = await fetchRemoteVersion();
    if (remote) {
      try {
        localStorage.setItem(STORAGE_KEY, remote);
      } catch {
        /* ignore */
      }
    }
    // Tenta acionar o ciclo do SW (update + skipWaiting). Se houver waiting,
    // o "controllerchange" recarrega a página automaticamente.
    const swActivating = await refreshServiceWorker();
    await clearAppCaches();
    if (!swActivating) {
      // Sem SW (ou sem atualização em waiting): recarrega com cache-bust.
      reloadWithBust();
    }
  }, []);

  return { needRefresh, checking, version, checkForUpdate: check, applyUpdate };
}
