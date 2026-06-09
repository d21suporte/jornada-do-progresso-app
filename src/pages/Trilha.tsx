import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { MobileShell } from "@/components/MobileShell";
import { useStorage } from "@/hooks/useStorage";
import { ArrowLeft, CheckCircle2, Loader2, Maximize2, Pause, Play, PlayCircle, Volume2, VolumeX, X } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  day: number;
  title: string;
  videoUrl: string;
  imageUrl?: string;
}

const LESSONS: Lesson[] = [
  { id: "aula0", day: 0, title: "Introdução", videoUrl: "https://jornadadoprogresso.com/wp-content/uploads/2026/06/aula0.mp4", imageUrl: "" },
  { id: "aula1", day: 1, title: "Aula 1", videoUrl: "https://jornadadoprogresso.com/wp-content/uploads/2026/06/aula1.mp4", imageUrl: "" },
  { id: "aula2", day: 2, title: "Aula 2", videoUrl: "https://jornadadoprogresso.com/wp-content/uploads/2026/06/aula2.mp4", imageUrl: "" },
  { id: "aula3", day: 3, title: "Aula 3", videoUrl: "https://jornadadoprogresso.com/wp-content/uploads/2026/06/aula3.mp4", imageUrl: "" },
  { id: "aula4", day: 4, title: "Aula 4", videoUrl: "https://jornadadoprogresso.com/wp-content/uploads/2026/06/aula4.mp4", imageUrl: "" },
];

interface LessonProgress {
  position: number; // seconds
  duration: number;
  completed: boolean;
  updatedAt: number;
}

type ProgressMap = Record<string, LessonProgress>;

const STORAGE_KEY = "trilha.progress.v1";

type FullscreenVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function statusOf(p?: LessonProgress): "todo" | "doing" | "done" {
  if (!p) return "todo";
  if (p.completed) return "done";
  if (p.position > 1) return "doing";
  return "todo";
}

const Trilha = () => {
  const [progress, setProgress] = useStorage<ProgressMap>(STORAGE_KEY, {});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const active = useMemo(() => LESSONS.find((l) => l.id === activeId) ?? null, [activeId]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);
  const fullscreenRequestedRef = useRef(false);
  const controlsTimerRef = useRef<number | null>(null);

  const saveProgress = useCallback((lessonId: string, extra?: Partial<LessonProgress>) => {
    const v = videoRef.current;
    if (!v) return;
    setProgress((prev) => ({
      ...prev,
      [lessonId]: {
        position: v.currentTime,
        duration: v.duration || prev[lessonId]?.duration || 0,
        completed: extra?.completed ?? prev[lessonId]?.completed ?? false,
        updatedAt: Date.now(),
        ...extra,
      },
    }));
  }, [setProgress]);

  const exitImmersive = useCallback(async () => {
    try {
      const so = screen.orientation as ScreenOrientation & { unlock?: () => void };
      so?.unlock?.();
    } catch { /* noop */ }
    try {
      const video = videoRef.current as FullscreenVideoElement | null;
      if (video?.webkitDisplayingFullscreen) video.webkitExitFullscreen?.();
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch { /* noop */ }
    fullscreenRequestedRef.current = false;
  }, []);

  const closePlayer = useCallback(async (completed = false) => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    const lessonId = active?.id;
    const v = videoRef.current;
    if (v) {
      v.pause();
      if (lessonId) saveProgress(lessonId, completed ? { completed: true, position: v.duration || v.currentTime } : undefined);
    }
    await exitImmersive();
    setActiveId(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    window.setTimeout(() => { isClosingRef.current = false; }, 0);
  }, [active?.id, exitImmersive, saveProgress]);

  const enterImmersive = useCallback(async () => {
    if (fullscreenRequestedRef.current) return;
    fullscreenRequestedRef.current = true;
    const el = playerRef.current;
    const video = videoRef.current as FullscreenVideoElement | null;
    try {
      if (el?.requestFullscreen && !document.fullscreenElement) {
        await el.requestFullscreen();
      } else if (video?.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      }
    } catch { /* mobile browser may block fullscreen */ }
    try {
      const so = screen.orientation as ScreenOrientation & { lock?: (orientation: string) => Promise<void> };
      await so?.lock?.("landscape");
    } catch { /* device may not allow orientation lock */ }
  }, []);

  const openLesson = useCallback((id: string) => {
    flushSync(() => setActiveId(id));
    setControlsVisible(true);
    void enterImmersive();
  }, [enterImmersive]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onFsChange = () => {
      if (!document.fullscreenElement && !isClosingRef.current) void closePlayer();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") void closePlayer();
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo(0, scrollY);
      void exitImmersive();
    };
  }, [active, closePlayer, exitImmersive]);

  useEffect(() => {
    if (!active || !controlsVisible) return;
    if (controlsTimerRef.current) window.clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = window.setTimeout(() => setControlsVisible(false), isPlaying ? 2600 : 5000);
    return () => {
      if (controlsTimerRef.current) window.clearTimeout(controlsTimerRef.current);
    };
  }, [active, controlsVisible, isPlaying]);


  // resume + persist
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !active) return;
    const saved = progress[active.id];
    const onLoaded = () => {
      if (saved && saved.position > 0 && saved.position < (v.duration || Infinity) - 2) {
        v.currentTime = saved.position;
      }
    };
    const save = (extra?: Partial<LessonProgress>) => saveProgress(active.id, extra);
    const onTime = () => {
      setCurrentTime(v.currentTime);
      setDuration(v.duration || 0);
      if (!v.duration) return;
      // throttle by 3s
      const last = progress[active.id]?.updatedAt ?? 0;
      if (Date.now() - last < 3000) return;
      const done = v.currentTime / v.duration >= 0.95;
      save(done ? { completed: true } : undefined);
    };
    const onLoaded = () => {
      setDuration(v.duration || 0);
      if (saved && saved.position > 0 && saved.position < (v.duration || Infinity) - 2) {
        v.currentTime = saved.position;
        setCurrentTime(saved.position);
      }
    };
    const onEnded = () => { save({ completed: true, position: v.duration }); void closePlayer(true); };
    const onPause = () => save();
    const onPlay = () => setIsPlaying(true);
    const onVideoPause = () => setIsPlaying(false);
    const onVolume = () => setIsMuted(v.muted);

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("pause", onPause);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onVideoPause);
    v.addEventListener("volumechange", onVolume);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onVideoPause);
      v.removeEventListener("volumechange", onVolume);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  const revealControls = useCallback(() => setControlsVisible(true), []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    revealControls();
    if (v.paused) void v.play();
    else v.pause();
  }, [revealControls]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
    revealControls();
  }, [revealControls]);

  const seekVideo = useCallback((value: string) => {
    const v = videoRef.current;
    if (!v) return;
    const next = Number(value);
    v.currentTime = next;
    setCurrentTime(next);
    revealControls();
  }, [revealControls]);

  return (
    <MobileShell>
      <header className="mb-5 flex items-center gap-3">
        <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary shadow-soft">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-primary">Aprendizado</p>
          <h1 className="text-xl font-bold tracking-tight">Trilha de Aprendizado</h1>
        </div>
      </header>

      <ul className="space-y-3">
        {LESSONS.map((l) => {
          const p = progress[l.id];
          const status = statusOf(p);
          const pct = p && p.duration ? Math.min(100, Math.round((p.position / p.duration) * 100)) : 0;
          return (
            <li key={l.id}>
              <button
                onClick={() => setActiveId(l.id)}
                className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-soft transition-smooth active:scale-[0.98]"
              >
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl",
                  status === "done" ? "bg-emerald-500/15 text-emerald-600"
                    : status === "doing" ? "bg-primary/15 text-primary"
                    : "bg-secondary text-secondary-foreground"
                )}>
                  {l.imageUrl ? (
                    <img src={l.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : status === "done" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : status === "doing" ? (
                    <Loader2 className="h-5 w-5" />
                  ) : (
                    <PlayCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Dia {l.day}</p>
                  <p className="truncate text-sm font-semibold">{l.title}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-primary/10">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wide",
                      status === "done" ? "text-emerald-600"
                        : status === "doing" ? "text-primary"
                        : "text-muted-foreground"
                    )}>
                      {status === "done" ? "Concluída" : status === "doing" ? "Em andamento" : "Não iniciada"}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {active && (
        <div
          ref={playerRef}
          className="fixed inset-0 z-50 flex flex-col bg-black"
        >
          <div className="flex items-center gap-3 p-3 text-white">
            <button onClick={closePlayer} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">Dia {active.day}</p>
              <p className="truncate text-sm font-semibold">{active.title}</p>
            </div>
            <button
              onClick={closePlayer}
              aria-label="Fechar"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center px-2 pb-2">
            <video
              ref={videoRef}
              src={active.videoUrl}
              poster={active.imageUrl || undefined}
              controls
              controlsList="nodownload"
              playsInline
              autoPlay
              preload="metadata"
              className="h-full max-h-full w-full rounded-lg bg-black object-contain"
            />
          </div>
        </div>
      )}

    </MobileShell>
  );
};

export default Trilha;
