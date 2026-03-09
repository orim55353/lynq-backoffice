"use client";

import { useCallback, useEffect, useState } from "react";

export function useSearchKeyboard(
  open: boolean,
  setOpen: (v: boolean) => void,
  totalCount: number,
  onSelect: (index: number) => void
) {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Reset active index when results change or palette closes
  useEffect(() => {
    setActiveIndex(-1);
  }, [totalCount, open]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  const handlePaletteKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (totalCount === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % totalCount);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + totalCount) % totalCount);
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        onSelect(activeIndex);
      }
    },
    [totalCount, activeIndex, onSelect, setOpen]
  );

  return { activeIndex, handlePaletteKeyDown };
}
