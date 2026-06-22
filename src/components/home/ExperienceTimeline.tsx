import { experience } from "@/data/experience";
import { Badge } from "@/components/ui/badge";

export function ExperienceTimeline() {
  return (
    <div className="space-y-8">
      {experience.map((exp, index) => (
        <div key={`${exp.company}-${index}`} className="relative pl-6 pb-8 last:pb-0">
          <div className="absolute left-0 top-0 flex h-full w-px flex-col items-center">
            <div className="relative z-10 flex size-3.5 items-center justify-center rounded-full bg-background">
              <div className="size-2 rounded-full bg-brand" />
            </div>
            {index !== experience.length - 1 && (
              <div className="flex-1 w-px bg-border" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="font-semibold text-foreground">{exp.role}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
              </div>
              <Badge variant="secondary" className="font-mono lowercase w-fit">
                {exp.period}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">{exp.description}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {exp.tech.map((tech) => (
                <Badge key={tech} variant="outline" className="font-normal text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}