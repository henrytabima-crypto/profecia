"use client";

import { useEffect, useRef, useState } from "react";

type Player = { getCurrentTime: () => number; destroy: () => void; getIframe: () => HTMLIFrameElement };
type YouTubeAPI = { Player: new (element: HTMLElement, options: { videoId: string; host: string; playerVars: Record<string, string | number>; events: { onReady: () => void; onStateChange: () => void; onError: (event: { data: number }) => void } }) => Player };
declare global { interface Window { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void } }
let api: Promise<YouTubeAPI> | undefined;
function loadYouTube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!api) api = new Promise<YouTubeAPI>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const timer = window.setTimeout(() => reject(new Error("YouTube unavailable")), 15000);
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timer);
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => { window.clearTimeout(timer); reject(new Error("YouTube unavailable")); };
    document.head.appendChild(script);
  });
  return api.catch((error) => { api = undefined; throw error; });
}

export default function LevelVideo({ id, title, start, onPosition }: { id: string; title: string; start: number; onPosition: (seconds: number) => void }) {
  const [attempt, setAttempt] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onPosition);
  const initial = useRef(start);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("YouTube no respondió en este navegador. Puedes volver a intentarlo o reproducir el video en YouTube.");
  useEffect(() => { callback.current = onPosition; }, [onPosition]);
  useEffect(() => {
    let disposed = false;
    let player: Player | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;
    // A stalled embedded frame can recover when recreated. Retry once only;
    // never replace a player that has already reported ready or a video error.
    const readyTimeout = window.setTimeout(() => {
      if (disposed) return;
      if (attempt === 0) setAttempt(1);
      else setStatus("error");
    }, 15000);
    let last = initial.current;
    const save = () => {
      const seconds = player?.getCurrentTime?.();
      if (typeof seconds === "number" && Number.isFinite(seconds) && seconds >= 0 && Math.floor(seconds) !== last) {
        last = Math.floor(seconds);
        initial.current = last;
        callback.current(last);
      }
    };
    loadYouTube().then((yt) => {
      if (disposed || !host.current) return;
      const mount = document.createElement("div");
      host.current.replaceChildren(mount);
      player = new yt.Player(mount, {
        host: "https://www.youtube.com", videoId: id,
        playerVars: { origin: window.location.origin, playsinline: 1, start: initial.current, rel: 0 },
        events: {
          onReady: () => {
            if (disposed) return;
            window.clearTimeout(readyTimeout);
            player?.getIframe().setAttribute("title", title);
            setStatus("ready");
            interval = setInterval(save, 3000);
          },
          onStateChange: save,
          onError: (event) => {
            window.clearTimeout(readyTimeout);
            if (disposed) return;
            setError(event.data === 153 ? "YouTube no pudo verificar este navegador para reproducir el video aquí. Puedes abrirlo en YouTube."
              : event.data === 101 || event.data === 150 ? "Este video no permite la reproducción dentro de otras páginas. Puedes verlo en YouTube."
              : event.data === 100 ? "Este video no está disponible o es privado."
              : "YouTube no pudo reproducir el video. Puedes volver a intentarlo o abrirlo en YouTube.");
            setStatus("error");
          },
        },
      });
    }).catch(() => { if (!disposed) setStatus("error"); });
    window.addEventListener("pagehide", save);
    return () => {
      disposed = true;
      window.clearTimeout(readyTimeout);
      save();
      window.removeEventListener("pagehide", save);
      if (interval) clearInterval(interval);
      player?.destroy();
    };
  }, [id, title, attempt]);
  return <div className="level-video-block">
    <div className="level-video" ref={host} />
    {status === "loading" && <p role="status">Cargando video…</p>}
    {status === "error" && <div className="level-video-recovery"><p role="status">{error}</p><button type="button" className="game-secondary" onClick={() => { setError("YouTube no respondió en este navegador. Puedes volver a intentarlo o reproducir el video en YouTube."); setStatus("loading"); setAttempt((value) => value + 1); }}>Volver a cargar</button><a href={`https://www.youtube.com/watch?v=${id}&t=${Math.floor(start)}s`} target="_blank" rel="noopener noreferrer">Ver en YouTube ↗</a></div>}
  </div>;
}
