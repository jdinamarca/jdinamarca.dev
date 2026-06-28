"use client";

import { NewsletterForm } from "./NewsletterForm";
import { GiscusComments } from "../comments/GiscusComments";

export function Newsletter() {
  return (
    <div className="space-y-12">
      <section className="rounded-lg border bg-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Newsletter</h2>
        <p className="mt-2 text-muted-foreground">
          Recibe los últimos posts y experimentos del Lab directamente en tu
 bandeja de entrada. Sin spam.
        </p>
        <div className="mt-4">
          <NewsletterForm />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Comentarios</h2>
        <p className="mt-2 text-muted-foreground">
          Inicia sesión con GitHub para dejar un comentario. Los comentarios se
 almacenan en GitHub Discussions.
        </p>
        <div className="mt-6">
          <GiscusComments />
        </div>
      </section>
    </div>
  );
}
