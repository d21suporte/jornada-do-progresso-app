import { createFileRoute } from "@tanstack/react-router";
import Trilha from "@/pages/Trilha";
import { RequireOnboarding } from "@/components/RequireOnboarding";

export const Route = createFileRoute("/trilha")({
  component: () => (
    <RequireOnboarding>
      <Trilha />
    </RequireOnboarding>
  ),
});
