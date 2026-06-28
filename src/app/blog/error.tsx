"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function BlogError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <AlertCircle className="mx-auto size-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error cargando el blog</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "No se pudieron cargar los posts. Inténtalo de nuevo."}
        </p>
        <Button onClick={reset} variant="outline">
          Reintentar
        </Button>
      </div>
    </div>
  );
}