import { useCallback } from "react";
import { useStorage } from "./useStorage";

export interface DayActionState {
  /** Map de id de step → marcado ou não */
  steps: Record<string, boolean>;
  /** Reflexão livre escrita pelo usuário */
  reflection: string;
}

type AllActions = Record<number, DayActionState>;

const EMPTY: DayActionState = { steps: {}, reflection: "" };

/**
 * Gerencia o progresso prático (checklist + reflexão) de cada dia da Jornada.
 * Salvo em localStorage por sessão de usuário.
 */
export function useJourneyDayActions() {
  const [actions, setActions] = useStorage<AllActions>("d21.journeyActions", {});

  const get = useCallback(
    (day: number): DayActionState => actions[day] ?? EMPTY,
    [actions]
  );

  const toggleStep = useCallback(
    (day: number, stepId: string) => {
      setActions((prev) => {
        const current = prev[day] ?? EMPTY;
        return {
          ...prev,
          [day]: {
            ...current,
            steps: { ...current.steps, [stepId]: !current.steps[stepId] },
          },
        };
      });
    },
    [setActions]
  );

  const setReflection = useCallback(
    (day: number, reflection: string) => {
      setActions((prev) => {
        const current = prev[day] ?? EMPTY;
        return { ...prev, [day]: { ...current, reflection } };
      });
    },
    [setActions]
  );

  const reset = useCallback(
    (day: number) => {
      setActions((prev) => {
        const next = { ...prev };
        delete next[day];
        return next;
      });
    },
    [setActions]
  );

  return { get, toggleStep, setReflection, reset };
}
