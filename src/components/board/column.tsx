"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import type { JobWithKit } from "@/lib/types";
import type { Status } from "@/lib/status";
import { SortableJobCard } from "./job-card";

export function Column({
  status,
  label,
  dotVar,
  jobs,
  onOpen,
}: {
  status: Status;
  label: string;
  dotVar: string;
  jobs: JobWithKit[];
  onOpen: (job: JobWithKit) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-72 shrink-0 flex-col sm:w-auto">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: `var(${dotVar})` }}
          aria-hidden
        />
        <span className="text-eyebrow text-ink-subtle">{label}</span>
        <span className="text-xs text-ink-tertiary">{jobs.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-32 flex-1 flex-col gap-2 rounded-lg p-2 transition-colors",
          isOver ? "bg-surface-1 ring-1 ring-hairline-strong" : "bg-transparent"
        )}
      >
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <SortableJobCard key={job.id} job={job} onOpen={onOpen} />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-ink-tertiary">
            Drop a card here
          </p>
        )}
      </div>
    </div>
  );
}
