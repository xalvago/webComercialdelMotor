"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Counter } from "@/components/animations";
import { useLanguage } from "@/lib/i18n";

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { t } = useLanguage();
  const s = t.stats;

  const stats = [
    { target: 130000, suffix: "+", label: s.referencias, prefix: "" },
    { target: 11, suffix: "", label: s.almacenes, prefix: "" },
    { target: 1200000, suffix: "+", label: s.peticiones, prefix: "" },
    { target: 1951, suffix: "", label: s.fundacion, prefix: "" },
  ];

  return (
    <section ref={ref} className="bg-[#EF0029] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div
                className="text-3xl md:text-4xl font-black text-white leading-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <Counter target={stat.target} suffix={stat.suffix} />
              </div>
              <div className="text-white/70 text-xs uppercase tracking-widest mt-2 font-mono">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
