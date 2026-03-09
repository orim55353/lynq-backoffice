"use client";

import { Briefcase, FileText, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { listItemTransition } from "@/components/ui/motion";
import type { SearchResultItem } from "@/lib/hooks/use-global-search";

const iconMap = {
  job: Briefcase,
  candidate: Users,
  campaign: Rocket,
  application: FileText,
} as const;

interface SearchResultRowProps {
  item: SearchResultItem;
  isActive: boolean;
  index: number;
  onClick: () => void;
}

export function SearchResultRow({ item, isActive, index, onClick }: SearchResultRowProps) {
  const Icon = iconMap[item.type];

  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0, transition: { ...listItemTransition, delay: index * 0.03 } }}
      className={[
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
        isActive
          ? "bg-lynq-accent/10 text-foreground"
          : "text-foreground/80 hover:bg-accent/50",
      ].join(" ")}
      onClick={onClick}
      role="option"
      aria-selected={isActive}
      data-index={index}
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
      </div>
      {item.status ? (
        <Badge variant="secondary" className="shrink-0 text-[10px] capitalize">
          {item.status}
        </Badge>
      ) : null}
    </motion.button>
  );
}
