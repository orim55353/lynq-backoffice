"use client";

import { type Transition, type Variants, useReducedMotion } from "framer-motion";

export const premiumEase = [0.22, 1, 0.36, 1] as const;

export const layoutSpring: Transition = {
  duration: 0.18,
  ease: premiumEase
};

export const panelTransition: Transition = {
  duration: 0.24,
  ease: premiumEase
};

export const listItemTransition: Transition = {
  duration: 0.18,
  ease: premiumEase
};

export function useEntranceMotion(distance = 20): Variants {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: panelTransition },
      exit: { opacity: 0, transition: { duration: 0.16 } }
    };
  }

  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0, transition: panelTransition },
    exit: { opacity: 0, y: Math.min(distance, 12), transition: { duration: 0.16, ease: premiumEase } }
  };
}

export function useSidebarMotion(distance = 24): Variants {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: panelTransition },
      exit: { opacity: 0, transition: { duration: 0.14 } }
    };
  }

  return {
    initial: { opacity: 0, x: distance },
    animate: { opacity: 1, x: 0, transition: panelTransition },
    exit: { opacity: 0, x: distance / 2, transition: { duration: 0.18, ease: premiumEase } }
  };
}

export function useCandidateContentMotion(): Variants {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: listItemTransition },
      exit: { opacity: 0, transition: { duration: 0.12 } }
    };
  }

  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: listItemTransition },
    exit: { opacity: 0, y: -6, transition: { duration: 0.12, ease: premiumEase } }
  };
}

export function useLiftMotion() {
  const reduceMotion = useReducedMotion();

  return reduceMotion ? {} : { y: -3 };
}

export function useTapMotion() {
  const reduceMotion = useReducedMotion();

  return reduceMotion ? {} : { scale: 0.985 };
}
