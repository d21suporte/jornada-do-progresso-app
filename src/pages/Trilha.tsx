import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useStorage } from "@/hooks/useStorage";
import { ArrowLeft, CheckCircle2, Loader2, PlayCircle, X } from "lucide-react";
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

function statusOf(p?: LessonProgress): "todo" | "doing" | "done" {
  if (!p) return "todo";
  if (p.completed) return "done";
  if (p.position > 1) return "doing";
  return "todo";
}

const Trilha = () => {
  const [progress, setProgress] = useStorage<ProgressMap>(STORAGE_KEY, {});
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(() => LESSONS.find((l) => l.id === activeId) ?? null, [activeId]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const exitImmersive = useCallback(async () => {
    try {
      const so = screen.orientation as ScreenOrientation & { unlock?: () => void };
      so?.unlock?.();
    } catch { /* noop */ }
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch { /* noop */ }
  }, []);

  const closePlayer = useCallback(() => {
    void exitImmersive();
    setActiveId(null);
  }, [exitImmersive]);

  // Enter fullscreen + lock landscape when a lesson opens
  useEffect(() => {
    if (!active) return;
    const el = playerRef.current;
    const tryEnter = async () => {
      try {
        if (el && !document.fullscreenElement) await el.requestFullscreen?.();
      } catch { /* noop */ }
      try {
        const so = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
        await so?.lock?.("landscape");
      } catch { /* device may not allow — fine */ }
    };
    void tryEnter();
    const onFsChange = () => {
      if (!document.fullscreenElement) closePlayer();
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      void exitImmersive();
    };
  }, [active, closePlayer, exitImmersive]);


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
    const save = (extra?: Partial<LessonProgress>) => {
      setProgress((prev) => ({
        ...prev,
        [active.id]: {
          position: v.currentTime,
          duration: v.duration || prev[active.id]?.duration || 0,
          completed: extra?.completed ?? prev[active.id]?.completed ?? false,
          updatedAt: Date.now(),
          ...extra,
        },
      }));
    };
    const onTime = () => {
      if (!v.duration) return;
      // throttle by 3s
      const last = progress[active.id]?.updatedAt ?? 0;
      if (Date.now() - last < 3000) return;
      const done = v.currentTime / v.duration >= 0.95;
      save(done ? { completed: true } : undefined);
    };
    const onEnded = () => save({ completed: true, position: v.duration });
    const onPause = () => save();

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

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
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur"
          onClick={() => setActiveId(null)}
        >
          <div className="flex items-center gap-3 p-4 text-white" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveId(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">Dia {active.day}</p>
              <p className="truncate text-sm font-semibold">{active.title}</p>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center px-4 pb-6" onClick={(e) => e.stopPropagation()}>
            <video
              ref={videoRef}
              src={active.videoUrl}
              poster={active.imageUrl || undefined}
              controls
              controlsList="nodownload"
              playsInline
              autoPlay
              preload="metadata"
              className="max-h-full w-full rounded-xl bg-black"
            />
          </div>
        </div>
      )}
    </MobileShell>
  );
};

export default Trilha;
