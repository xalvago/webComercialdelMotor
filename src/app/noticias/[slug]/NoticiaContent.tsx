"use client";

import Link from "next/link";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { useLanguage, type Lang } from "@/lib/i18n";
import noticiasData from "@/lib/data/noticias.json";

const LOCALES: Record<Lang, string> = { es: "es-ES", en: "en-GB", fr: "fr-FR" };

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(LOCALES[lang], { day: "numeric", month: "long", year: "numeric" });
}

interface Props {
  noticia: (typeof noticiasData)[0];
  slug: string;
}

type NoticiaMl = (typeof noticiasData)[0] & {
  titulo_en?: string; titulo_fr?: string;
  categoria_en?: string; categoria_fr?: string;
  bodyLines?: string[];
};

function mlField(obj: Record<string, string | undefined>, field: string, lang: string): string {
  if (lang !== "es") {
    const v = obj[`${field}_${lang}`];
    if (v) return v;
  }
  return obj[field] ?? "";
}

export default function NoticiaContent({ noticia, slug }: Props) {
  const { t, lang } = useLanguage();
  const n = t.noticiaSlug;
  const ml = noticia as unknown as NoticiaMl;

  const titulo = mlField(ml as unknown as Record<string, string | undefined>, "titulo", lang);
  const categoria = mlField(ml as unknown as Record<string, string | undefined>, "categoria", lang);
  const bodyLines = ml.bodyLines;

  const otras = noticiasData.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border-b border-[#EEEEEE] dark:border-[#2A2A2A] py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-[#888888] dark:text-[#AAAAAA] hover:text-[#EF0029] text-xs font-mono mb-6 transition-colors"
          >
            <ArrowLeft size={13} />
            {n.volver}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 bg-[#EF0029] text-white font-mono"
              style={{ borderRadius: "2px" }}
            >
              <Tag size={10} />
              {categoria}
            </span>
            <span className="text-[#AAAAAA] dark:text-[#999999] text-xs font-mono flex items-center gap-1.5">
              <Calendar size={11} />
              {formatDate(noticia.fecha, lang)}
            </span>
          </div>

          <h1
            className="text-3xl md:text-4xl font-black text-[#111111] dark:text-[#F0F0F0] leading-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {titulo}
          </h1>
          <div className="w-12 h-0.5 bg-[#EF0029]" />
        </div>
      </div>

      {/* Image placeholder */}
      <div className="bg-gradient-to-br from-[#F0F0F0] to-[#E8E8E8] dark:from-[#1A1A1A] dark:to-[#222222] h-64 md:h-80" />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2">
            <p className="text-[#444444] dark:text-[#CCCCCC] text-lg leading-relaxed mb-6 font-medium">
              {noticia.excerpt}
            </p>
            {bodyLines && bodyLines.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[#111111] dark:text-[#F0F0F0] font-black text-sm tracking-widest uppercase mb-6"
                   style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  COMERCIAL DEL MOTOR, S.A.
                </p>
                {bodyLines.map((line, i) => {
                  const isNumbered = /^\d+\./.test(line);
                  const isBullet = /^[–\-]/.test(line);
                  const isSection = /^\([ivx]+\)/.test(line);
                  return (
                    <p
                      key={i}
                      className={`leading-relaxed text-sm ${
                        isSection
                          ? "font-semibold text-[#111111] dark:text-[#F0F0F0] mt-4"
                          : isNumbered
                          ? "ml-4 text-[#333333] dark:text-[#CCCCCC]"
                          : isBullet
                          ? "ml-6 text-[#555555] dark:text-[#AAAAAA]"
                          : "text-[#444444] dark:text-[#CCCCCC]"
                      }`}
                    >
                      {line}
                    </p>
                  );
                })}
              </div>
            ) : (
              <>
                <p className="text-[#666666] dark:text-[#999999] leading-relaxed mb-4">{n.body1}</p>
                <p className="text-[#666666] dark:text-[#999999] leading-relaxed">{n.body2}</p>
              </>
            )}
          </article>

          <aside>
            <div className="card-light p-5 sticky top-24">
              <h3 className="text-[#EF0029] text-xs uppercase tracking-widest font-mono mb-4">
                {n.otrasNoticias}
              </h3>
              <div className="space-y-4">
                {otras.map((item) => (
                  <Link key={item.id} href={`/noticias/${item.slug}`} className="block group">
                    <p
                      className="text-[#555555] dark:text-[#AAAAAA] text-xs leading-snug group-hover:text-[#EF0029] transition-colors line-clamp-2 mb-0.5"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {item.titulo}
                    </p>
                    <span className="text-[#BBBBBB] dark:text-[#AAAAAA] text-[10px] font-mono">
                      {formatDate(item.fecha, lang)}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-[#EEEEEE] dark:border-[#2A2A2A]">
                <Link href="/noticias" className="text-[#EF0029] text-xs font-mono hover:underline">
                  {n.verTodas}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
