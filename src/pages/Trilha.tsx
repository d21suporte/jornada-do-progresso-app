import { useCallback, useEffect, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useStorage } from "@/hooks/useStorage";
import {
  ArrowLeft,
  CheckCircle2,
  Maximize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
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
  position: number;
  duration: number;
  completed: boolean;
  updatedAt: number;
}

type ProgressMap = Record<string, LessonProgress>;
const STORAGE_KEY = "trilha.progress.v1";

type FullscreenVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function statusOf(p?: LessonProgress): "todo" | "doing" | "done" {
  if (!p) return "todo";
  if (p.completed) return "done";
  if (p.position > 1) return "doing";
  return "todo";
}

interface LessonCardProps {
  lesson: Lesson;
  progress?: LessonProgress;
  onUpdate: (id: string, extra?: Partial<LessonProgress>) => void;
}

function LessonCard({ lesson, progress, onUpdate }: LessonCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [current, setCurrent] = useState(progress?.position ?? 0);
  const [duration, setDuration] = useState(progress?.duration ?? 0);
  const [started, setStarted] = useState(false);
  const lastSaveRef = useRef(0);
  const resumedRef = useRef(false);

  const status = statusOf(progress);
  const pct = duration ? Math.min(100, (current / duration) * 100) : 0;

  const save = useCallback(
    (extra?: Partial<LessonProgress>) => {
      const v = videoRef.current;
      if (!v) return;
      onUpdate(lesson.id, {
        position: v.currentTime,
        duration: v.duration || duration,
        ...extra,
      });
    },
    [lesson.id, onUpdate, duration],
  );

  const handleLoaded = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
    if (!resumedRef.current && progress?.position && progress.position < (v.duration || Infinity) - 2) {
      v.currentTime = progress.position;
      setCurrent(progress.position);
    }
    resumedRef.current = true;
  };

  const handleTime = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrent(v.currentTime);
    if (!v.duration) return;
    if (Date.now() - lastSaveRef.current < 3000) return;
    lastSaveRef.current = Date.now();
    const done = v.currentTime / v.duration >= 0.95;
    save(done ? { completed: true } : undefined);
  };

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    if (v.paused) {
      try {
        await v.play();
      } catch {
        /* noop */
      }
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const seek = (value: string) => {
    const v = videoRef.current;
    if (!v) return;
    const next = Number(value);
    v.currentTime = next;
    setCurrent(next);
  };

  const enterFullscreen = async () => {
    const v = videoRef.current as FullscreenVideoElement | null;
    const w = wrapperRef.current;
    if (!v) return;
    try {
      if (v.webkitEnterFullscreen) {
        v.webkitEnterFullscreen();
        return;
      }
      if (w?.requestFullscreen) {
        await w.requestFullscreen();
      } else if (v.requestFullscreen) {
        await v.requestFullscreen();
      }
    } catch {
      /* noop */
    }
  };

  // cleanup: save on unmount
  useEffect(() => {
    return () => {
      const v = videoRef.current;
      if (!v || !v.duration) return;
      onUpdate(lesson.id, {
        position: v.currentTime,
        duration: v.duration,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
      <div
        ref={wrapperRef}
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: "16 / 9" }}
      >
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          poster={lesson.imageUrl || undefined}
          preload="metadata"
          playsInline
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          onLoadedMetadata={handleLoaded}
          onTimeUpdate={handleTime}
          onPlay={() => setIsPlaying(true)}
          onPause={() => {
            setIsPlaying(false);
            save();
          }}
          onEnded={() => {
            setIsPlaying(false);
            save({ completed: true });
          }}
          onVolumeChange={() => {
            const v = videoRef.current;
            if (v) setIsMuted(v.muted);
          }}
          className="absolute inset-0 h-full w-full object-contain"
        />

        {!started && !isPlaying && (
          <button
            onClick={togglePlay}
            aria-label="Reproduzir"
            className="absolute inset-0 flex items-center justify-center bg-black/30 transition-smooth active:scale-95"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft">
              <Play className="h-6 w-6 fill-current" />
            </span>
          </button>
        )}

        {started && (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2 pt-8 text-white">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            </button>
            <span className="w-9 text-[10px] font-medium tabular-nums text-white/85">
              {formatTime(current)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(current, duration || current)}
              onChange={(e) => seek(e.target.value)}
              aria-label="Progresso"
              className="h-1 min-w-0 flex-1 accent-primary"
            />
            <span className="w-9 text-right text-[10px] font-medium tabular-nums text-white/85">
              {formatTime(duration)}
            </span>
            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Ativar som" : "Silenciar"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={enterFullscreen}
              aria-label="Tela cheia"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
              Dia {lesson.day}
            </p>
            <p className="truncate text-sm font-semibold">{lesson.title}</p>
          </div>
          {status === "done" && (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wide",
              status === "done"
                ? "text-emerald-600"
                : status === "doing"
                  ? "text-primary"
                  : "text-muted-foreground",
            )}
          >
            {status === "done" ? "Concluída" : status === "doing" ? "Em andamento" : "Não iniciada"}
          </span>
        </div>
      </div>
    </div>
  );
}

const Trilha = () => {
  const [progress, setProgress] = useStorage<ProgressMap>(STORAGE_KEY, {});

  const update = useCallback(
    (id: string, extra?: Partial<LessonProgress>) => {
      setProgress((prev) => {
        const prior = prev[id];
        return {
          ...prev,
          [id]: {
            position: extra?.position ?? prior?.position ?? 0,
            duration: extra?.duration ?? prior?.duration ?? 0,
            completed: extra?.completed ?? prior?.completed ?? false,
            updatedAt: Date.now(),
          },
        };
      });
    },
    [setProgress],
  );

  return (
    <MobileShell>
      <header className="mb-5 flex items-center gap-3">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary shadow-soft"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-primary">Aprendizado</p>
          <h1 className="text-xl font-bold tracking-tight">Trilha de Aprendizado</h1>
        </div>
      </header>

      <div className="space-y-4">
        {LESSONS.map((l) => (
          <LessonCard key={l.id} lesson={l} progress={progress[l.id]} onUpdate={update} />
        ))}
      </div>
    </MobileShell>
  );
};

export default Trilha;
