"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export default function HeroVideo() {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        preload="auto"
      >
        <source src="/video/animation_motor.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/50 to-[#0A0A0A]" />
      <div className="absolute inset-0 bg-[#0A0A0A]/30" />

      {/* Red accent line left */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-gradient-to-b from-transparent via-[#EF0029] to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Label */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#EF0029]" />
            <span
              className="text-[#EF0029] text-xs uppercase tracking-[0.3em]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {h.eyebrow}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.95] text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {h.h1_1}
            <br />
            <span className="text-[#EF0029]">{h.h1_2}</span>
            <br />
            {h.h1_3}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl"
          >
            {h.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link href="/productos" className="btn-primary group">
              {h.ctaPrimary}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/delegaciones" className="btn-outline">
              {h.ctaSecondary}
            </Link>
          </motion.div>

          {/* Stats mini */}
          <motion.div
            variants={itemVariants}
            className="flex gap-8 mt-12 pt-8 border-t border-white/10"
          >
            {[
              { val: "130K+", label: h.stat1 },
              { val: "11", label: h.stat2 },
              { val: "75", label: h.stat3 },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {s.val}
                </div>
                <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-white/30 text-xs tracking-widest uppercase font-mono">
          {h.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
