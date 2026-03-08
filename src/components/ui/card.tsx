import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { layoutSpring, panelTransition, useLiftMotion, useTapMotion } from "@/components/ui/motion";

const cardBaseClass = "rounded-xl border bg-card text-card-foreground";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardBaseClass, className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

export interface MotionCardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
}

const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, interactive = false, whileHover, whileTap, transition, initial, animate, ...props }, ref) => {
    const hoverLift = useLiftMotion();
    const tapMotion = useTapMotion();

    return (
      <motion.div
        ref={ref}
        initial={initial ?? { opacity: 0, y: 12 }}
        animate={animate ?? { opacity: 1, y: 0 }}
        whileHover={whileHover ?? (interactive ? hoverLift : undefined)}
        whileTap={whileTap ?? (interactive ? tapMotion : undefined)}
        transition={transition ?? (interactive ? layoutSpring : panelTransition)}
        className={cn(cardBaseClass, className)}
        {...props}
      />
    );
  }
);
MotionCard.displayName = "MotionCard";

export { Card, MotionCard };
