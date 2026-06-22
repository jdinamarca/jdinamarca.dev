import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { playingWith, type PlayingWith } from "@/data/playing-with";

const statusColors: Record<PlayingWith["status"], { border: string; text: string }> = {
  testing: { border: "border-yellow-500/50", text: "text-yellow-400" },
  exploring: { border: "border-blue-500/50", text: "text-blue-400" },
  building: { border: "border-green-500/50", text: "text-green-400" },
  comparing: { border: "border-purple-500/50", text: "text-purple-400" },
};

const statusLabel: Record<PlayingWith["status"], string> = {
  testing: "Probando",
  exploring: "Explorando",
  building: "Construyendo",
  comparing: "Comparando",
};

export function CurrentlyPlaying() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {playingWith.map((item) => {
        const colors = statusColors[item.status];

        return (
          <Card
            key={item.name}
            className="h-full transition-all duration-200 ring-foreground/10 hover:ring-brand/40 hover:-translate-y-0.5"
          >
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className="text-2xl">{item.icon}</span>
                <Badge variant="outline" className={`${colors.border} ${colors.text}`}>
                  {statusLabel[item.status]}
                </Badge>
              </div>

              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-lg font-semibold leading-snug text-foreground hover:text-brand transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">
                  {item.name}
                </h3>
              )}

              <p className="text-sm text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}