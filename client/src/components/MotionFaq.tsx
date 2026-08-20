import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type FaqItem = { question: string; answer: string };

export function MotionFaq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="motion-faq" data-reveal>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <article className="motion-faq-item" key={item.question}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="motion-faq-trigger"
            >
              <span>{item.question}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}>
                {isOpen ? <Minus size={17} strokeWidth={1.55} /> : <Plus size={17} strokeWidth={1.55} />}
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { duration: 0.34, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.2 } }}
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
