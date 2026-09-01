import { ArrowDown } from "lucide-react";

function WeakAreas({ weakAreas }) {
  const hasAreas = weakAreas && weakAreas.length > 0;

  return (
    <section className="rounded-xl border bg-background p-6">
      <div>
        <h2 className="font-semibold">Focus areas</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Topics that deserve more practice.
        </p>
      </div>

      <div className="mt-6">
        {hasAreas ? (
          <div className="space-y-4">
            {weakAreas.map((item, idx) => {
              const name = typeof item === "string" ? item : item.name;
              const desc = typeof item === "string" ? "Recommended area for review and practice." : item.description;
              return (
                <div key={name || idx} className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">{name}</span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">No focus areas identified yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Complete interviews to discover specific topics that need more practice.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default WeakAreas;