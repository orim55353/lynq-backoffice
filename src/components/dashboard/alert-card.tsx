import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { MotionCard } from "@/components/ui/card";

interface AlertCardProps {
  type: "warning" | "success" | "info" | "danger";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  aiPowered?: boolean;
}

const alertStyles = {
  warning: {
    border: "border-warning/30",
    background: "bg-warning/5",
    icon: <AlertTriangle className="h-4 w-4 text-warning" />,
    actionColor: "text-warning hover:text-warning/80"
  },
  success: {
    border: "border-success/30",
    background: "bg-success/5",
    icon: <CheckCircle2 className="h-4 w-4 text-success" />,
    actionColor: "text-success hover:text-success/80"
  },
  info: {
    border: "border-info/30",
    background: "bg-info/5",
    icon: <Info className="h-4 w-4 text-info" />,
    actionColor: "text-info hover:text-info/80"
  },
  danger: {
    border: "border-danger/30",
    background: "bg-danger/5",
    icon: <XCircle className="h-4 w-4 text-danger" />,
    actionColor: "text-danger hover:text-danger/80"
  }
} satisfies Record<string, { border: string; background: string; icon: ReactNode; actionColor: string }>;

export function AlertCard({ type, title, description, action, aiPowered }: AlertCardProps) {
  const style = alertStyles[type];

  return (
    <MotionCard interactive className={`rounded-[20px] border p-4 shadow-soft ${style.border} ${style.background}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{style.icon}</div>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-2">
            <h4 className="text-sm font-medium">{title}</h4>
            {aiPowered ? (
              <span className="rounded bg-lynq-accent-muted px-1.5 py-0.5 text-[10px] font-medium text-lynq-accent">
                AI
              </span>
            ) : null}
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>

        {action ? (
          <button onClick={action.onClick} className={`shrink-0 text-xs font-medium ${style.actionColor}`}>
            {action.label}
          </button>
        ) : null}
      </div>
    </MotionCard>
  );
}
