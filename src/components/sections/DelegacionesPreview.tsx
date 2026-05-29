"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Phone } from "lucide-react";
import { FadeInUp, Stagger, fadeInUp } from "@/components/animations";
import delegacionesData from "@/lib/data/delegaciones.json";
import { useLanguage } from "@/lib/i18n";

const delegaciones = delegacionesData.slice(0, 6);

export default function DelegacionesPreview() {
  const { t } = useLanguage();
  const d = t.delegaciones;

  return (
    <section className="py-24 bg-[#ECEAE6] dark:bg-[#181816] relative overflow-hidden">

      {/* Mapa fondo */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden
      >
        <Image
          src="/mapa_espana.png"
          alt=""
          fill
          className="object-cover"
          style={{
            opacity: 0.55,
            filter: "saturate(0.3) grayscale(15%)",
          }}
          unoptimized
          priority={false}
        />
      </div>

      {/* Dark mode — suppresses map image lightening bg */}
      <div className="absolute inset-0 hidden dark:block bg-[#181816]/65 pointer-events-none" style={{ zIndex: 1 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="section-label mb-3">{d.eyebrow}</div>
            <h2 className="section-title">
              {d.title1}
              <br />
              <span className="text-[#EF0029]">{d.title2}</span>
            </h2>
            <div className="red-line mt-4" />
            <p className="text-[#777777] dark:text-[#AAAAAA] text-sm mt-4 max-w-xs">
              {d.subtitle}
            </p>
          </div>
          <Link
            href="/delegaciones"
            className="inline-flex items-center gap-2 text-[#666666] dark:text-[#AAAAAA] hover:text-[#EF0029] dark:hover:text-[#EF0029] text-sm transition-colors group"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {d.verTodas}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </FadeInUp>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {delegaciones.map((del) => (
            <motion.div
              key={del.id}
              variants={fadeInUp}
              className="group p-5 border transition-all duration-300"
              style={{
                borderRadius: "4px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 100%)",
                backdropFilter: "blur(28px) saturate(1.6)",
                WebkitBackdropFilter: "blur(28px) saturate(1.6)",
                border: "1px solid rgba(255,255,255,0.28)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    borderRadius: "2px",
                    backgroundColor: del.central ? "#EF0029" : "rgba(239,0,41,0.07)",
                  }}
                >
                  <MapPin size={14} className={del.central ? "text-white" : "text-[#EF0029]"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="text-[#111111] dark:text-[#F0F0F0] font-semibold text-sm truncate"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {del.nombre}
                    </h3>
                    {del.central && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 bg-[#EF0029] text-white font-mono flex-shrink-0"
                        style={{ borderRadius: "2px" }}
                      >
                        {d.central}
                      </span>
                    )}
                  </div>
                  <p className="text-[#888888] dark:text-[#AAAAAA] text-xs leading-relaxed mb-2">
                    {del.ciudad}, {del.cp}
                  </p>
                  <a
                    href={`tel:${del.telefono.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-[#AAAAAA] dark:text-[#999999] hover:text-[#EF0029] text-xs font-mono transition-colors"
                  >
                    <Phone size={11} />
                    {del.telefono}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
