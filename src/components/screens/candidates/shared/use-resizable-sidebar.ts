"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useEffect, useState } from "react";

interface UseResizableSidebarOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function useResizableSidebar({
  initialWidth = 480,
  minWidth = 380,
  maxWidth = 560
}: UseResizableSidebarOptions = {}) {
  const clampWidth = useCallback(
    (width: number) => Math.min(Math.max(width, minWidth), maxWidth),
    [maxWidth, minWidth]
  );

  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    setSidebarWidth((currentWidth) => clampWidth(currentWidth));

    const handleResize = () => {
      setSidebarWidth((currentWidth) => clampWidth(currentWidth));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [clampWidth]);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";

    const handleMouseMove = (event: MouseEvent) => {
      const nextWidth = clampWidth(window.innerWidth - event.clientX);
      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, clampWidth]);

  return {
    sidebarWidth,
    startResizing: (event: ReactMouseEvent<HTMLElement>) => {
      event.preventDefault();
      window.getSelection()?.removeAllRanges();
      setIsResizing(true);
    }
  };
}
