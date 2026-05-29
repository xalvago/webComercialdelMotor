"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { FadeInUp, Stagger } from "@/components/animations";
import noticiasData from "@/lib/data/noticias.json";
import { useLanguage, type Lang } from "@/lib/i18n";

const LOCALES: Record<Lang, string> = { es: "es-ES", en: "en-GB", fr: "fr-FR" };

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(LOCALES[lang], { day: "numeric", month: "long", year: "numeric" });
}

export default function NoticiasPage() {
  const { t, lang } = useLanguage();
  const n = t.noticiasPage;

  const featured = noticiasData[0];
  const rest = noticiasData.slice(1);
  const categorias = Array.from(new Set(noticiasData.map((item) => item.categoria)));

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border-b border-[#EEEEEE] dark:border-[#2A2A2A] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="section-label mb-3">{n.eyebrow}</div>
            <h1 className="section-title">
              {n.h1_1} <span className="text-[#EF0029]">{n.h1_2}</span>
            </h1>
          </FadeInUp>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Featured post */}
            <FadeInUp className="mb-10">
              <Link href={`/noticias/${featured.slug}`} className="group block card-light overflow-hidden lg:flex">
                <div className="lg:w-64 h-48 lg:h-auto bg-gradient-to-br from-[#F0F0F0] to-[#E8E8E8] dark:from-[#1A1A1A] dark:to-[#222222] flex-shrink-0 relative">
                  <div className="absolute top-3 left-3">
                    <span className="text-xs px-2 py-0.5 bg-[#EF0029] text-white font-mono" style={{ borderRadius: "2px" }}>
                      {n.destacada}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs px-2 py-0.5 bg-[#F5F5F5] dark:bg-[#2A2A2A] text-[#888888] dark:text-[#AAAAAA] font-mono border border-[#EEEEEE] dark:border-[#3A3A3A]" style={{ borderRadius: "2px" }}>
                      {featured.categoria}
                    </span>
                    <span className="text-[#AAAAAA] dark:text-[#999999] text-xs font-mono flex items-center gap-1.5">
                      <Calendar size={11} />
                      {formatDate(featured.fecha, lang)}
                    </span>
                  </div>
                  <h2 className="text-[#111111] dark:text-[#F0F0F0] text-xl font-bold group-hover:text-[#EF0029] transition-colors mb-3 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {featured.titulo}
                  </h2>
                  <p className="text-[#777777] dark:text-[#AAAAAA] text-sm leading-relaxed line-clamp-3 mb-4">{featured.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-[#EF0029] text-sm font-mono group-hover:gap-3 transition-all">
                    {n.leerArticulo} <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </FadeInUp>

            {/* Grid */}
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rest.map((noticia) => (
                <Link key={noticia.id} href={`/noticias/${noticia.slug}`} className="group card-light overflow-hidden">
                  <div className="h-44 bg-gradient-to-br from-[#F5F5F5] to-[#EEEEEE] dark:from-[#1A1A1A] dark:to-[#222222] relative overflow-hidden">
                    <div className="absolute inset-0 group-hover:bg-[#EF0029]/3 transition-colors duration-300" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] px-2 py-0.5 bg-[#EF0029] text-white font-mono" style={{ borderRadius: "2px" }}>
                        {noticia.categoria}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-3 text-[#AAAAAA] dark:text-[#999999] text-xs font-mono">
                      <Calendar size={11} />
                      {formatDate(noticia.fecha, lang)}
                    </div>
                    <h3 className="text-[#111111] dark:text-[#F0F0F0] font-bold leading-snug mb-2 group-hover:text-[#EF0029] transition-colors line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {noticia.titulo}
                    </h3>
                    <p className="text-[#777777] dark:text-[#AAAAAA] text-sm line-clamp-2 mb-4">{noticia.excerpt}</p>
                    <span className="inline-flex items-center gap-1.5 text-[#EF0029] text-xs font-mono group-hover:gap-2.5 transition-all">
                      {n.leer} <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </Stagger>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <FadeInUp delay={0.2}>
              <div className="card-light p-5 mb-6">
                <h3 className="text-[#EF0029] text-xs uppercase tracking-widest font-mono mb-4">{n.categorias}</h3>
                <div className="space-y-2">
                  {categorias.map((cat) => {
                    const count = noticiasData.filter((item) => item.categoria === cat).length;
                    return (
                      <div key={cat} className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0] dark:border-[#2A2A2A] last:border-0">
                        <span className="text-[#555555] dark:text-[#AAAAAA] text-sm hover:text-[#EF0029] cursor-pointer transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {cat}
                        </span>
                        <span className="text-[#CCCCCC] dark:text-[#AAAAAA] text-xs font-mono">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card-light p-5">
                <h3 className="text-[#EF0029] text-xs uppercase tracking-widest font-mono mb-4">{n.recientes}</h3>
                <div className="space-y-3">
                  {noticiasData.slice(0, 4).map((item) => (
                    <Link key={item.id} href={`/noticias/${item.slug}`} className="block group">
                      <p className="text-[#555555] dark:text-[#AAAAAA] text-xs leading-snug group-hover:text-[#EF0029] transition-colors line-clamp-2 mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.titulo}
                      </p>
                      <span className="text-[#BBBBBB] dark:text-[#AAAAAA] text-[10px] font-mono">{formatDate(item.fecha, lang)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeInUp>
          </aside>
        </div>
      </div>
    </div>
  );
}
