import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/ui/card";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <MotionCard className="flex flex-col items-center justify-center rounded-[22px] border-border bg-card p-12 text-center shadow-soft">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? (
        <Button onClick={action.onClick} className="bg-lynq-accent text-lynq-accent-foreground hover:bg-lynq-accent-hover">
          {action.label}
        </Button>
      ) : null}
    </MotionCard>
  );
}
