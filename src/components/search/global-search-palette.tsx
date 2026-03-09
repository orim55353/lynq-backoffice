"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { panelTransition, premiumEase } from "@/components/ui/motion";
import { useGlobalSearch } from "@/lib/hooks/use-global-search";
import { useSearchKeyboard } from "./use-search-keyboard";
import { SearchResultRow } from "./search-result-item";
import type { SearchResultItem } from "@/lib/hooks/use-global-search";

interface GlobalSearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: panelTransition },
  exit: { opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.14, ease: premiumEase } },
};

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label} ({count})
    </p>
  );
}

export function GlobalSearchPalette({ open, onOpenChange }: GlobalSearchPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const { jobs, candidates, campaigns, applications, totalCount, isLoading } = useGlobalSearch(query);

  // Build flat list for keyboard navigation
  const allResults = useMemo<SearchResultItem[]>(
    () => [...jobs, ...applications, ...candidates, ...campaigns],
    [jobs, applications, candidates, campaigns]
  );

  const handleSelect = useCallback(
    (index: number) => {
      const item = allResults[index];
      if (item) {
        router.push(item.href);
        onOpenChange(false);
      }
    },
    [allResults, router, onOpenChange]
  );

  const { activeIndex, handlePaletteKeyDown } = useSearchKeyboard(
    open,
    onOpenChange,
    totalCount,
    handleSelect
  );

  // Auto-focus input when opened & reset query
  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const hasQuery = query.trim().length > 0;

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => onOpenChange(false)}
          />

          {/* Panel */}
          <div className="flex justify-center px-4">
            <motion.div
              className="relative mt-[15vh] w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onKeyDown={handlePaletteKeyDown}
            >
              {/* Input */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                ) : (
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jobs, candidates, campaigns..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
                  esc
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto p-1.5" role="listbox">
                {!hasQuery ? (
                  <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                    Type to search across jobs, candidates, and campaigns
                  </p>
                ) : totalCount === 0 && !isLoading ? (
                  <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{query.trim()}&rdquo;
                  </p>
                ) : (
                  <>
                    {jobs.length > 0 ? (
                      <div>
                        <SectionHeader label="Jobs" count={jobs.length} />
                        {jobs.map((item, i) => (
                          <SearchResultRow
                            key={item.id}
                            item={item}
                            isActive={activeIndex === i}
                            index={i}
                            onClick={() => {
                              router.push(item.href);
                              onOpenChange(false);
                            }}
                          />
                        ))}
                      </div>
                    ) : null}

                    {applications.length > 0 ? (
                      <div>
                        <SectionHeader label="Applications" count={applications.length} />
                        {applications.map((item, i) => {
                          const flatIndex = jobs.length + i;
                          return (
                            <SearchResultRow
                              key={item.id}
                              item={item}
                              isActive={activeIndex === flatIndex}
                              index={flatIndex}
                              onClick={() => {
                                router.push(item.href);
                                onOpenChange(false);
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : null}

                    {candidates.length > 0 ? (
                      <div>
                        <SectionHeader label="Candidates" count={candidates.length} />
                        {candidates.map((item, i) => {
                          const flatIndex = jobs.length + applications.length + i;
                          return (
                            <SearchResultRow
                              key={item.id}
                              item={item}
                              isActive={activeIndex === flatIndex}
                              index={flatIndex}
                              onClick={() => {
                                router.push(item.href);
                                onOpenChange(false);
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : null}

                    {campaigns.length > 0 ? (
                      <div>
                        <SectionHeader label="Campaigns" count={campaigns.length} />
                        {campaigns.map((item, i) => {
                          const flatIndex = jobs.length + applications.length + candidates.length + i;
                          return (
                            <SearchResultRow
                              key={item.id}
                              item={item}
                              isActive={activeIndex === flatIndex}
                              index={flatIndex}
                              onClick={() => {
                                router.push(item.href);
                                onOpenChange(false);
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
                <span><kbd className="rounded border border-border px-1 py-0.5 font-mono">↑↓</kbd> Navigate</span>
                <span><kbd className="rounded border border-border px-1 py-0.5 font-mono">↵</kbd> Open</span>
                <span><kbd className="rounded border border-border px-1 py-0.5 font-mono">esc</kbd> Close</span>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
