"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText, Award, Shield, CheckCircle, Clock, Users, ArrowUpRight,
  Building2, MapPin, Settings, TrendingUp, Layers, Star, Zap,
} from "lucide-react";
import { FadeInUp, Stagger, fadeInUp } from "@/components/animations";
import { useLanguage } from "@/lib/i18n";

const tipoIcon: Record<string, React.ElementType> = {
  fundacion: Building2,
  expansion: MapPin,
  calidad: Settings,
  certificacion: Award,
  hito: TrendingUp,
  proceso: Layers,
  hoy: Star,
};

export default function CalidadPage() {
  const { t } = useLanguage();
  const c = t.calidadPage;

  const pilares = [
    { icon: Shield,      titulo: c.pilar1titulo, desc: c.pilar1desc },
    { icon: CheckCircle, titulo: c.pilar2titulo, desc: c.pilar2desc },
    { icon: Clock,       titulo: c.pilar3titulo, desc: c.pilar3desc },
    { icon: Users,       titulo: c.pilar4titulo, desc: c.pilar4desc },
  ];

  const timeline = [
    { year: "1951", evento: c.t1951, tipo: "fundacion" },
    { year: "1985", evento: c.t1985, tipo: "expansion" },
    { year: "1999", evento: c.t1999, tipo: "calidad" },
    { year: "2005", evento: c.t2005, tipo: "certificacion" },
    { year: "2010", evento: c.t2010, tipo: "hito" },
    { year: "2015", evento: c.t2015, tipo: "certificacion" },
    { year: "2020", evento: c.t2020, tipo: "proceso" },
    { year: "2026", evento: c.t2026, tipo: "hoy" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] pt-20">

      {/* Hero */}
      <div className="border-b border-[#EEEEEE] dark:border-[#2A2A2A] py-24 relative overflow-hidden min-h-[380px] flex items-center">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <Image
            src="/operario_calidad.png"
            alt=""
            fill
            className="object-cover object-center"
            style={{
              filter: "saturate(0.55) grayscale(15%) brightness(1.05)",
              opacity: 0.55,
            }}
            unoptimized
            priority
          />
        </div>
        {/* Capa 1 — frosted glass base */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
          }}
        />
        {/* Gradiente — zona izquierda, modo claro */}
        <div
          className="absolute inset-0 pointer-events-none dark:hidden"
          style={{
            background:
              "linear-gradient(90deg, rgba(250,250,250,0.92) 0%, rgba(250,250,250,0.82) 25%, rgba(250,250,250,0.40) 50%, transparent 70%)",
          }}
        />
        {/* Gradiente — zona izquierda, modo oscuro */}
        <div
          className="absolute inset-0 pointer-events-none hidden dark:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.88) 30%, rgba(10,10,10,0.55) 55%, transparent 75%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <FadeInUp>
            <div className="max-w-xl">
              <div className="section-label mb-3">{c.eyebrow}</div>
              <h1 className="section-title mb-4">
                {c.h1_1}
                <br />
                <span className="text-[#EF0029]">{c.h1_2}</span>
              </h1>
              <div className="red-line mb-6" />
              <p className="text-[#555555] dark:text-[#999999] max-w-xl leading-relaxed">{c.desc}</p>
            </div>
          </FadeInUp>
        </div>
      </div>

      {/* Certificación principal */}
      <section className="py-16 relative dark:bg-[#111111]" style={{
        background: "linear-gradient(180deg, #fafafa 0%, #f6f4f4 60%, #f5f5f5 100%)",
      }}>
        <div className="absolute inset-0 hidden dark:block bg-[#111111]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeInUp>
              <div className="section-label mb-3">{c.certActivaLabel}</div>
              <h2 className="section-title mb-6">{c.certTitle}</h2>
              <p className="text-[#666666] dark:text-[#999999] leading-relaxed mb-6">{c.certText}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.comercialdelmotor.com/pdf/politica-de-calidad_comercial-del-motor_ed4.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary justify-center w-full sm:flex-1"
                >
                  <FileText size={16} />
                  {c.solicitarPolitica}
                </a>
                <a
                  href="https://www.comercialdelmotor.com/images/Ecertificate-FS41002es.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline justify-center w-full sm:flex-1"
                >
                  <Award size={16} />
                  {c.solicitarCert}
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <div className="card-light p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden" style={{ borderRadius: "2px" }}>
                    <Image src="/ISO_9001.jpg" alt="ISO 9001:2015" width={64} height={64} className="object-contain w-full h-full" unoptimized />
                  </div>
                  <div className="text-[#111111] dark:text-[#F0F0F0] font-bold text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ISO 9001:2015</div>
                  <div className="text-[#AAAAAA] dark:text-[#999999] text-xs font-mono">{c.certActivo}</div>
                </div>

                <div className="card-light p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden" style={{ borderRadius: "2px" }}>
                    <Image src="/bsi_icon.png" alt="BSI Certified" width={64} height={64} className="object-contain w-full h-full" unoptimized />
                  </div>
                  <div className="text-[#111111] dark:text-[#F0F0F0] font-bold text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>BSI Certified</div>
                  <div className="text-[#AAAAAA] dark:text-[#999999] text-xs font-mono">{c.britishStandards}</div>
                </div>

                <div className="card-light p-6 col-span-2 border-[#EF0029]/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { val: "2005", label: c.anoCert },
                      { val: "100%", label: c.almacenesCert },
                      { val: "Anual", label: c.auditoria },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="text-xl font-black text-[#EF0029]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                        <div className="text-[#AAAAAA] dark:text-[#999999] text-[10px] font-mono mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* 4 Pilares */}
      <section className="py-16 border-y border-[#EEEEEE] dark:border-[#2A2A2A] relative" style={{
        background: "linear-gradient(160deg, #ffffff 0%, #f9f9f9 40%, #f5f5f5 100%)",
      }}>
        <div className="absolute inset-0 hidden dark:block bg-[#0F0F0F]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInUp className="text-center mb-12">
            <div className="section-label mb-3">{c.enfoqueEyebrow}</div>
            <h2 className="section-title">{c.enfoqueTitle1} <span className="text-[#EF0029]">{c.enfoqueTitle2}</span></h2>
          </FadeInUp>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pilares.map((pilar) => {
              const Icon = pilar.icon;
              return (
                <motion.div key={pilar.titulo} variants={fadeInUp} className="card-light p-6 text-center group">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ borderRadius: "2px", backgroundColor: "rgba(239,0,41,0.07)" }}>
                    <Icon size={20} className="text-[#EF0029]" />
                  </div>
                  <h3 className="text-[#111111] dark:text-[#F0F0F0] font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{pilar.titulo}</h3>
                  <p className="text-[#777777] dark:text-[#AAAAAA] text-sm leading-relaxed">{pilar.desc}</p>
                </motion.div>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 relative" style={{
        background: "linear-gradient(180deg, #f5f5f5 0%, #fafafa 40%, #ffffff 100%)",
      }}>
        <div className="absolute inset-0 hidden dark:block bg-[#0A0A0A]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInUp className="mb-12">
            <div className="section-label mb-3">{c.historiaEyebrow}</div>
            <h2 className="section-title">{c.historiaTitle1} <span className="text-[#EF0029]">{c.historiaTitle2}</span></h2>
          </FadeInUp>

          <div className="relative">
            <motion.div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#EF0029] via-[#EF0029]/40 to-transparent"
              initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              viewport={{ once: true }}
            />
            <div className="space-y-6">
              {timeline.map((item, i) => {
                const HitoIcon = tipoIcon[item.tipo] ?? Zap;
                const isRight = i % 2 !== 0;
                return (
                  <FadeInUp key={item.year} delay={i * 0.1}>
                    <div className={`relative flex items-center gap-6 md:gap-0 ${isRight ? "md:flex-row-reverse" : "md:flex-row"}`}>
                      <div className={`flex-1 ${isRight ? "md:pl-12" : "md:pr-12 md:text-right"} pl-12 md:pl-0`}>
                        <motion.div
                          className={`card-light p-4 inline-block ${item.tipo === "hoy" ? "border-[#EF0029]/30" : ""}`}
                          whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(239,0,41,0.10)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className={`flex items-center gap-3 mb-2 ${isRight ? "" : "md:flex-row-reverse"}`}>
                            <div
                              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                              style={{ borderRadius: "2px", backgroundColor: item.tipo === "hoy" ? "rgba(239,0,41,0.12)" : "rgba(239,0,41,0.06)" }}
                            >
                              <HitoIcon size={14} className="text-[#EF0029]" />
                            </div>
                            <div className="text-[#EF0029] text-lg font-black" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.year}</div>
                          </div>
                          <p className="text-[#555555] dark:text-[#AAAAAA] text-sm leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.evento}</p>
                        </motion.div>
                      </div>

                      {/* Dot on timeline */}
                      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10 flex-shrink-0">
                        <motion.div
                          className="w-3 h-3 bg-[#EF0029]"
                          style={{ borderRadius: "50%" }}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: i * 0.1 + 0.4, duration: 0.3, type: "spring", stiffness: 300 }}
                          viewport={{ once: true }}
                        />
                        {item.tipo === "hoy" && (
                          <motion.div
                            className="absolute inset-0 bg-[#EF0029]"
                            style={{ borderRadius: "50%" }}
                            animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </div>

                      <div className="hidden md:block flex-1" />
                    </div>
                  </FadeInUp>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
