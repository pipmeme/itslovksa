import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  icon?: string;
}

interface FounderTimelineProps {
  milestones: TimelineMilestone[];
}

const FounderTimeline = ({ milestones }: FounderTimelineProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setShowControls(maxScroll > 4);
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, milestones]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
  };

  const handleSelect = (i: number) => {
    setActiveIndex(activeIndex === i ? null : i);
    // Scroll the selected item into view on mobile
    const el = scrollRef.current;
    if (el) {
      const items = el.querySelectorAll("[data-milestone]");
      const item = items[i] as HTMLElement;
      if (item) {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const scrollTo = itemCenter - el.clientWidth / 2;
        el.scrollTo({ left: scrollTo, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative py-4 sm:py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-4 sm:mb-7"
      >
        <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1">
          The Journey
        </p>
        <h3 className="font-display text-sm sm:text-lg md:text-xl font-bold tracking-tight">
          Tap a milestone to explore
        </h3>
      </motion.div>

      {/* Horizontal scrollable track */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 touch-pan-x"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="relative min-w-max flex items-start gap-0 py-1">
          {/* Horizontal line */}
          <div className="absolute top-[20px] sm:top-[26px] left-4 right-4 h-[2px] bg-border" />
          <motion.div
            className="absolute top-[20px] sm:top-[26px] left-4 h-[2px] gradient-bg"
            initial={{ width: 0 }}
            whileInView={{ width: "calc(100% - 32px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />

          {milestones.map((m, i) => {
            const isActive = activeIndex === i;
            return (
              <div
                key={i}
                data-milestone
                className="flex flex-col items-center"
                style={{ width: "clamp(80px, 20vw, 150px)" }}
              >
                {/* Dot button — larger tap target on mobile */}
                <button
                  onClick={() => handleSelect(i)}
                  className="relative z-10 group focus:outline-none p-1"
                  aria-label={`${m.year}: ${m.title}`}
                >
                  <motion.div
                    className={`w-[38px] h-[38px] sm:w-[52px] sm:h-[52px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "border-primary bg-primary/10 scale-110 shadow-lg shadow-primary/20"
                        : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                    }`}
                    whileTap={{ scale: 0.92 }}
                  >
                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                      isActive ? "gradient-bg" : "bg-muted-foreground/40"
                    }`} />
                  </motion.div>
                </button>

                {/* Year label */}
                <p
                  className={`mt-1.5 sm:mt-2.5 text-[0.6rem] sm:text-xs font-bold transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {m.year}
                </p>

                {/* Short title */}
                <p className="mt-0.5 text-[0.5rem] sm:text-[0.65rem] text-muted-foreground text-center leading-tight px-0.5 line-clamp-2 max-w-[80px] sm:max-w-[100px]">
                  {m.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      {showControls && (
        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 px-1">
          <button
            onClick={() => scroll("left")}
            className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground active:bg-muted transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-muted-foreground/40"
              style={{ width: "35%" }}
              animate={{ x: `${scrollProgress * 185}%` }}
              transition={{ type: "tween", duration: 0.1 }}
            />
          </div>

          <button
            onClick={() => scroll("right")}
            className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground active:bg-muted transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      {/* Expanded detail card */}
      <AnimatePresence mode="wait">
        {activeIndex !== null && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 sm:mt-5 rounded-xl border border-primary/20 bg-card p-3.5 sm:p-5 shadow-sm">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-bg flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[0.6rem] sm:text-xs font-bold gradient-bg text-primary-foreground">
                      {milestones[activeIndex].year}
                    </span>
                  </div>
                  <h4 className="font-display text-xs sm:text-base font-bold text-foreground mb-0.5 sm:mb-1 leading-snug">
                    {milestones[activeIndex].title}
                  </h4>
                  <p className="text-[0.7rem] sm:text-sm text-muted-foreground leading-relaxed">
                    {milestones[activeIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FounderTimeline;
