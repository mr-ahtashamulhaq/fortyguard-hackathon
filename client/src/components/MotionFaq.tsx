import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

type FaqItem = { question: string; answer: string };

export function MotionFaq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const rawId = useId();
  const baseId = `agriguard-faq-${rawId.replace(/:/g, "")}`;
  const reduceMotion = useReducedMotion();

  return (
    <div className="motion-faq" data-reveal>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <article className="motion-faq-item" key={item.question}>
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
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`${baseId}-answer-${index}`}
                  role="region"
                  aria-labelledby={`${baseId}-question-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { height: { duration: 0.34, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.2 } }}
                  className="motion-faq-answer-wrap"
                >
                  <p>{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}
