"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Phone } from "lucide-react";
import { FadeInUp } from "@/components/animations";
import { useLanguage } from "@/lib/i18n";

export default function CtaBanner() {
  const { t } = useLanguage();
  const c = t.cta;

  return (
    <section className="py-24 bg-[#111111] relative overflow-hidden">
      {/* Subtle red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#EF0029]/8 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className="border border-white/10 p-8 md:p-16 text-center"
          style={{ borderRadius: "4px" }}
        >
          <FadeInUp>
            <div
              className="text-[#EF0029] text-xs font-bold uppercase tracking-widest mb-6"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {c.eyebrow}
            </div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <h2
              className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {c.title1}{" "}
              <span className="text-[#EF0029]">{c.title2}</span>
              <br />
              {c.title3}
            </h2>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <p className="text-white/50 max-w-lg mx-auto mb-10 leading-relaxed">
              {c.subtitle}
            </p>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/productos" className="btn-primary">
                <Search size={16} />
                {c.buscar}
              </Link>
              <a href="tel:+34917109940" className="btn-outline-white">
                <Phone size={16} />
                +34 91 710 99 40
              </a>
            </div>
          </FadeInUp>

          <motion.div
            className="mt-12 h-px bg-gradient-to-r from-transparent via-[#EF0029]/30 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </section>
  );
}
