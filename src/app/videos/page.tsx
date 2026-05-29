"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Clock, Calendar } from "lucide-react";
import { FadeInUp, Stagger, fadeInUp } from "@/components/animations";
import videosData from "@/lib/data/videos.json";
import { useLanguage, type Lang } from "@/lib/i18n";

const LOCALES: Record<Lang, string> = { es: "es-ES", en: "en-GB", fr: "fr-FR" };

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(LOCALES[lang], { month: "short", year: "numeric" });
}

export default function VideosPage() {
  const { t, lang } = useLanguage();
  const vp = t.videosPage;

  const [activeVideo, setActiveVideo] = useState<(typeof videosData)[0] | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>(vp.todos);

  const categorias = [vp.todos, ...Array.from(new Set(videosData.map((v) => v.categoria)))];
  const filtered =
    filtroCategoria === vp.todos
      ? videosData
      : videosData.filter((v) => v.categoria === filtroCategoria);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border-b border-[#EEEEEE] dark:border-[#2A2A2A] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="section-label mb-3">{vp.eyebrow}</div>
            <h1 className="section-title">
              {vp.h1_1} <span className="text-[#EF0029]">{vp.h1_2}</span>
            </h1>
            <p className="text-[#888888] dark:text-[#AAAAAA] text-sm mt-2">{vp.subtitle}</p>
          </FadeInUp>

          <FadeInUp delay={0.1} className="mt-6 flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-4 py-1.5 text-xs font-mono border transition-all duration-200 ${
                  filtroCategoria === cat
                    ? "bg-[#EF0029] border-[#EF0029] text-white"
                    : "border-[#DDDDDD] dark:border-[#2A2A2A] text-[#666666] dark:text-[#999999] hover:border-[#EF0029] hover:text-[#EF0029] bg-white dark:bg-[#1A1A1A]"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {cat}
              </button>
            ))}
          </FadeInUp>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((video) => (
            <motion.button
              key={video.id}
              variants={fadeInUp}
              onClick={() => setActiveVideo(video)}
              className="group card-light overflow-hidden text-left w-full"
            >
              <div className="relative h-44 bg-[#111111] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.titulo}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-12 h-12 bg-[#EF0029] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#EF0029]/40"
                    style={{ borderRadius: "50%" }}
                  >
                    <Play size={18} className="text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
                  {video.duracion}
                </div>
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] px-2 py-0.5 bg-[#EF0029] text-white font-mono" style={{ borderRadius: "2px" }}>
                    {video.categoria}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-[#111111] dark:text-[#F0F0F0] font-semibold text-sm leading-snug group-hover:text-[#EF0029] transition-colors line-clamp-2 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {video.titulo}
                </h3>
                <p className="text-[#888888] dark:text-[#AAAAAA] text-xs line-clamp-2 mb-3">{video.descripcion}</p>
                <div className="flex items-center gap-3 text-[#BBBBBB] dark:text-[#AAAAAA] text-[10px] font-mono">
                  <span className="flex items-center gap-1"><Clock size={10} />{video.duracion}</span>
                  <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(video.fecha, lang)}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </Stagger>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-4xl bg-white dark:bg-[#111111] border border-[#E8E8E8] dark:border-[#2A2A2A] shadow-2xl"
              style={{ borderRadius: "4px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between p-4 border-b border-[#EEEEEE] dark:border-[#2A2A2A]">
                <div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#EF0029] text-white font-mono" style={{ borderRadius: "2px" }}>
                    {activeVideo.categoria}
                  </span>
                  <h3 className="text-[#111111] dark:text-[#F0F0F0] font-bold mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {activeVideo.titulo}
                  </h3>
                </div>
                <button onClick={() => setActiveVideo(null)} className="text-[#AAAAAA] hover:text-[#111111] dark:hover:text-white transition-colors p-1">
                  <X size={20} />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 bg-[#FAFAFA] dark:bg-[#1A1A1A]">
                <p className="text-[#666666] dark:text-[#999999] text-sm">{activeVideo.descripcion}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
