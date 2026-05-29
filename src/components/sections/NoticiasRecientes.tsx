"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { FadeInUp, Stagger, fadeInUp } from "@/components/animations";
import noticiasData from "@/lib/data/noticias.json";
import { useLanguage, type Lang } from "@/lib/i18n";

const noticias = noticiasData.slice(0, 3);

const LOCALES: Record<Lang, string> = {
  es: "es-ES",
  en: "en-GB",
  fr: "fr-FR",
};

function formatDate(iso: string, lang: Lang) {
  const d = new Date(iso);
  return d.toLocaleDateString(LOCALES[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type NoticiaMl = (typeof noticiasData)[0] & {
  titulo_en?: string; titulo_fr?: string;
  excerpt_en?: string; excerpt_fr?: string;
  categoria_en?: string; categoria_fr?: string;
};

function ml(obj: Record<string, string | undefined>, field: string, lang: string): string {
  if (lang !== "es") { const v = obj[`${field}_${lang}`]; if (v) return v; }
  return obj[field] ?? "";
}

export default function NoticiasRecientes() {
  const { t, lang } = useLanguage();
  const n = t.noticias;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/video/pixverse_v6.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0A0A0A]/80" style={{ zIndex: 1 }} />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/60"
        style={{ zIndex: 1 }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 2 }}>
        {/* Header */}
        <FadeInUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-[#EF0029] text-xs uppercase tracking-[0.2em] font-mono mb-3">
              {n.eyebrow}
            </div>
            <h2
              className="text-white font-black text-4xl sm:text-5xl leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {n.title1}
              <br />
              <span className="text-[#EF0029]">{n.title2}</span>
            </h2>
            <div className="mt-4 h-[3px] w-12 bg-[#EF0029]" />
          </div>
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#EF0029] text-sm transition-colors group"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {n.verTodas}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </FadeInUp>

        {/* Cards */}
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {noticias.map((noticiaRaw) => {
            const noticia = noticiaRaw as NoticiaMl;
            const titulo = ml(noticia as unknown as Record<string, string | undefined>, "titulo", lang);
            const excerpt = ml(noticia as unknown as Record<string, string | undefined>, "excerpt", lang);
            const categoria = ml(noticia as unknown as Record<string, string | undefined>, "categoria", lang);
            return (
            <motion.article
              key={noticia.id}
              variants={fadeInUp}
              className="group overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                backdropFilter: "blur(8px)",
              }}
            >
              <Link href={`/noticias/${noticia.slug}`}>
                {/* Image placeholder */}
                <div className="h-48 bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 group-hover:bg-[#EF0029]/10 transition-colors duration-300" />
                  <div className="absolute bottom-3 left-3">
                    <span
                      className="text-xs px-2 py-0.5 bg-[#EF0029] text-white font-mono"
                      style={{ borderRadius: "2px" }}
                    >
                      {categoria}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={12} className="text-white/30" />
                    <span className="text-white/40 text-xs font-mono">
                      {formatDate(noticia.fecha, lang)}
                    </span>
                  </div>

                  <h3
                    className="text-white font-bold leading-snug mb-2 group-hover:text-[#EF0029] transition-colors line-clamp-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {titulo}
                  </h3>

                  <p className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-4">
                    {excerpt}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-[#EF0029] text-xs font-mono group-hover:gap-2.5 transition-all duration-200">
                    {n.leerMas}
                    <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            </motion.article>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
