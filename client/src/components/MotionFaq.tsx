import { Minus, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

type FaqItem = { question: string; answer: string };

export function MotionFaq({ items, gap = 12 }: { items: FaqItem[]; gap?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rawId = useId();
  const baseId = `agriguard-faq-${rawId.replace(/:/g, "")}`;
  const reduceMotion = useReducedMotion();

  return (
    <div className="motion-faq" data-reveal style={{ gap }}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.article
            layout
            initial={false}
            animate={{ scale: isOpen ? 1 : 0.985 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
            className="motion-faq-item"
            key={item.question}
          >
            <button
              id={`${baseId}-question-${index}`}
              type="button"
              aria-controls={`${baseId}-answer-${index}`}
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="motion-faq-trigger"
            >
              <span>{item.question}</span>
              <motion.span animate={{ rotate: isOpen && !reduceMotion ? 180 : 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.32, 0.72, 0, 1] }}>
                {isOpen ? <Minus size={17} strokeWidth={1.55} /> : <Plus size={17} strokeWidth={1.55} />}
              </motion.span>
            </button>
            <motion.div
              id={`${baseId}-answer-${index}`}
              role="region"
              aria-labelledby={`${baseId}-question-${index}`}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { height: { type: "spring", stiffness: 340, damping: 34, mass: 0.9 }, opacity: { duration: 0.2, ease: "easeOut" } }}
              className="motion-faq-answer-wrap"
            >
              <motion.p animate={{ y: isOpen ? 0 : -8 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30, mass: 0.8 }}>{item.answer}</motion.p>
            </motion.div>
          </motion.article>
        );
      })}
    </div>
  );
}
