"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Phone } from "lucide-react";
import { FadeInUp } from "@/components/animations";
import { useLanguage } from "@/lib/i18n";


export default function ProductosDestacados() {
  const { t } = useLanguage();
  const c = t.cta;

  return (
    <section className="py-24 bg-[#F7F7F5] dark:bg-[#111111] relative overflow-hidden">
      {/* Red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-72 rounded-full bg-[#EF0029]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInUp delay={0.1} className="text-center">
          <div
            className="text-[#EF0029] text-xs font-bold uppercase tracking-widest mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {c.eyebrow}
          </div>

          <h2
            className="text-2xl md:text-4xl font-black text-[#1A1A1A] dark:text-white mb-4 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {c.title1}{" "}
            <span className="text-[#EF0029]">{c.title2}</span>
            <br />
            {c.title3}
          </h2>

          <p className="text-[#777777] dark:text-white/50 max-w-lg mx-auto mb-8 leading-relaxed text-sm">
            {c.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/productos" className="btn-primary justify-center">
              <Search size={16} />
              {c.buscar}
            </Link>
            <a href="tel:+34917109940" className="btn-outline justify-center">
              <Phone size={16} />
              +34 91 710 99 40
            </a>
          </div>

          <motion.div
            className="mt-10 h-px bg-gradient-to-r from-transparent via-[#EF0029]/20 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          />
        </FadeInUp>
      </div>
    </section>
  );
}
