import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <header className="mb-12 max-w-2xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-2 h-5 w-full" />
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="flex flex-col gap-3 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}