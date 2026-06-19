"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Clock, Sun } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const lineV = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const eyebrowV = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
};

const redLineV = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.65, delay: 0.35, ease } },
};

const fadeUpV = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: d, ease },
  }),
};

const scrollV = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.6, duration: 0.6 } },
};

function TechGrid() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#34495E" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid-large" width="320" height="320" patternUnits="userSpaceOnUse">
          <rect width="320" height="320" fill="url(#grid)" />
          <path d="M 320 0 L 0 0 0 320" fill="none" stroke="#34495E" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-large)" opacity="0.04" />
      <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#EF0029" strokeWidth="0.5" opacity="0.08" />
      <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#EF0029" strokeWidth="0.5" opacity="0.06" />
    </svg>
  );
}

const bannerV = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, delay: 0.5, ease } },
};

type SummerBanner = {
  title: string;
  zone1: string;
  hours1: string;
  zone2: string;
  hours2: string;
};

/** Ghost map: real map image, white bg removed via invert+screen blend */
function GhostMap({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden
      className={className}
      style={{ filter: "invert(1) brightness(1.5)", mixBlendMode: "screen", opacity: 0.4 }}
    />
  );
}

function SummerBannerContent({ sb, large = false }: { sb: SummerBanner; large?: boolean }) {
  const titleSize = large ? "text-xs" : "text-xs";
  const iconSize = large ? 16 : 14;
  const zoneSize = large ? "text-sm" : "text-sm";
  const hoursSize = large ? "text-sm" : "text-sm";
  const mapH = large ? "h-20 lg:h-24" : "h-8";
  return (
    <>
      <div className={`flex items-center gap-2 ${large ? "mb-3" : "mb-3"} relative`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          <Clock size={iconSize} className="text-[#EF0029]" />
        </motion.div>
        <span
          className={`text-[#EF0029] ${titleSize} uppercase tracking-[0.15em] font-bold`}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {sb.title}
        </span>
        {large && (
          <motion.div
            className="absolute -top-2 -right-1"
            animate={{ rotate: [0, 12, -8, 0], y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          >
            <Sun size={22} className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
          </motion.div>
        )}
      </div>
      {large && (
        <p
          className="text-amber-300/90 text-[11px] italic -mt-1 mb-3 rotate-[-1deg]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          ¡Que no te pille el calor sin tus piezas! ☀️
        </p>
      )}
      <div className={large ? "space-y-3" : "space-y-3"}>
        <div>
          <span className={`block text-white font-semibold ${zoneSize}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {sb.zone1}
          </span>
          <GhostMap src="/peninsula.jpg" alt="" className={`${mapH} w-full object-contain my-1`} />
          <span className={`block text-white/75 ${hoursSize}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {sb.hours1}
          </span>
        </div>
        <div>
          <span className={`block text-white font-semibold ${zoneSize}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {sb.zone2}
          </span>
          <GhostMap src="/canarias.jpg" alt="" className={`${mapH} w-full object-contain my-1`} />
          <span className={`block text-white/75 ${hoursSize}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {sb.hours2}
          </span>
        </div>
      </div>
    </>
  );
}

export default function HeroSection() {
  const { t } = useLanguage();
  const h = t.hero;
  const sb = t.summerBanner;

  const lines = [
    { text: h.h1_1, accent: false },
    { text: h.h1_2, accent: false },
    { text: h.h1_3, accent: true },
  ];

  const stats = [
    { val: "130K+", label: h.stat1 },
    { val: "10",    label: h.stat2 },
    { val: "75+",   label: h.stat3 },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden md:pt-20">

      {/* Background video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
        >
          <source src="/video/animation_motor.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0D0D0D]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/30 via-transparent to-[#0D0D0D]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/50 via-transparent to-transparent" />
      </div>

      <TechGrid />

      {/* Left red accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[#EF0029] to-transparent opacity-70" />

      {/* Summer schedule banner — desktop, raised to headline height */}
      <motion.div
        variants={bannerV}
        initial="hidden"
        animate={{
          opacity: 1,
          x: 0,
          boxShadow: [
            "0 0 0px rgba(239,0,41,0.0)",
            "0 0 36px rgba(239,0,41,0.55)",
            "0 0 0px rgba(239,0,41,0.0)",
          ],
        }}
        transition={{
          opacity: { duration: 0.55, delay: 0.5, ease },
          x: { duration: 0.55, delay: 0.5, ease },
          boxShadow: { repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 1 },
        }}
        className="hidden md:block absolute top-32 lg:top-36 right-6 sm:right-8 lg:right-12 z-20 w-72 lg:w-80 bg-[#1a0306]/90 backdrop-blur-md border-2 border-[#EF0029]/70 px-5 py-4"
      >
        <SummerBannerContent sb={sb} large />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-28 md:py-0">
          <div className="max-w-4xl">

            {/* Eyebrow */}
            <motion.div
              variants={eyebrowV}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-6 h-px bg-[#EF0029]" />
              <span
                className="text-[#EF0029] text-xs uppercase tracking-[0.25em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {`// ${h.h1_3.toUpperCase()}`}
              </span>
            </motion.div>

            {/* Headline — split text */}
            <motion.h1
              variants={containerV}
              initial="hidden"
              animate="visible"
              className="overflow-hidden"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {lines.map((line, i) => (
                <motion.span
                  key={i}
                  variants={lineV}
                  className={`block leading-[1.0] font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight ${
                    line.accent ? "text-[#EF0029]" : "text-white"
                  }`}
                >
                  {line.text}
                </motion.span>
              ))}
            </motion.h1>

            {/* Red line animated */}
            <motion.div
              variants={redLineV}
              initial="hidden"
              animate="visible"
              style={{ originX: 0 }}
              className="mt-6 h-[3px] w-16 bg-[#EF0029]"
            />

            {/* Subtitle */}
            <motion.p
              variants={fadeUpV}
              custom={0.55}
              initial="hidden"
              animate="visible"
              className="mt-6 text-white/55 text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {h.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUpV}
              custom={0.7}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/productos" className="btn-primary group">
                {h.ctaPrimary}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
              <Link href="/delegaciones" className="btn-outline-white">
                {h.ctaSecondary}
              </Link>
            </motion.div>

            {/* Mini stats strip */}
            <motion.div
              variants={fadeUpV}
              custom={0.85}
              initial="hidden"
              animate="visible"
              className="mt-14 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-sm"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    className="text-white font-black text-xl"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {s.val}
                  </div>
                  <div className="text-white/35 text-[11px] uppercase tracking-wider mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Summer schedule banner — mobile, below stats strip */}
            <motion.div
              variants={fadeUpV}
              custom={1.0}
              initial="hidden"
              animate="visible"
              className="md:hidden mt-6 max-w-sm bg-[#0D0D0D]/80 backdrop-blur-md border border-[#EF0029]/30 px-5 py-4"
            >
              <SummerBannerContent sb={sb} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        variants={scrollV}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-2 pb-8"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={14} className="text-white/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
