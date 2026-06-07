"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobWithKit } from "@/lib/types";

function kitReady(job: JobWithKit) {
  return Boolean(job.kit && job.kit.coverLetter);
}

/** Pure visual card — reused inside the drag overlay. */
export function JobCardView({
  job,
  dragging,
}: {
  job: JobWithKit;
  dragging?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface-1 border border-hairline edge-highlight p-3 text-left",
        "transition-colors hover:bg-surface-2 hover:border-hairline-strong",
        dragging && "bg-surface-2 border-hairline-strong shadow-lg shadow-black/40"
      )}
    >
      <p className="text-sm font-medium text-ink leading-snug line-clamp-2">
        {job.title || "Untitled role"}
      </p>
      <p className="mt-1 text-xs text-ink-subtle truncate">
        {job.company || "Unknown company"}
        {job.location ? ` · ${job.location}` : ""}
      </p>
      {kitReady(job) && (
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-surface-2 border border-hairline px-2 py-0.5 text-[11px] font-medium text-ink-muted">
          <Sparkles size={11} className="text-primary" />
          Kit ready
        </span>
      )}
    </div>
  );
}

/** Sortable + clickable card on the board. */
export function SortableJobCard({
  job,
  onOpen,
}: {
  job: JobWithKit;
  onOpen: (job: JobWithKit) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  return (
    <button
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "block w-full cursor-grab active:cursor-grabbing focus-ring rounded-lg",
        isDragging && "opacity-40"
      )}
      onClick={() => onOpen(job)}
      {...attributes}
      {...listeners}
    >
      <JobCardView job={job} />
    </button>
  );
}
