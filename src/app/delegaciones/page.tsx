"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { FadeInUp, Stagger, fadeInUp } from "@/components/animations";
import delegacionesData from "@/lib/data/delegaciones.json";
import DelegacionesMap from "@/components/sections/DelegacionesMap";
import { useLanguage } from "@/lib/i18n";

const regionSet = new Set(delegacionesData.map((d) => d.region));

export default function DelegacionesPage() {
  const { t } = useLanguage();
  const dp = t.delegacionesPage;

  const regiones = [dp.todas, ...Array.from(regionSet)];

  const [selected, setSelected] = useState<(typeof delegacionesData)[0] | null>(null);
  const [filtroRegion, setFiltroRegion] = useState<string>(dp.todas);

  const filtered =
    filtroRegion === dp.todas
      ? delegacionesData
      : delegacionesData.filter((d) => d.region === filtroRegion);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border-b border-[#EEEEEE] dark:border-[#2A2A2A] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="section-label mb-3">{dp.eyebrow}</div>
            <h1 className="section-title">
              {dp.h1_1} <span className="text-[#EF0029]">{dp.h1_2}</span>
            </h1>
            <p className="text-[#888888] dark:text-[#AAAAAA] text-sm mt-2">{dp.subtitle}</p>
          </FadeInUp>
        </div>
      </div>

      {/* Map */}
      <div className="border-b border-[#EEEEEE] dark:border-[#2A2A2A]">
        <DelegacionesMap delegaciones={delegacionesData} selected={selected} onSelect={setSelected} />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#111111] border-b border-[#EEEEEE] dark:border-[#2A2A2A] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {regiones.map((r) => (
              <button
                key={r}
                onClick={() => setFiltroRegion(r)}
                className={`px-3 py-1 text-xs font-mono border transition-all ${
                  filtroRegion === r
                    ? "bg-[#EF0029] border-[#EF0029] text-white"
                    : "border-[#DDDDDD] dark:border-[#2A2A2A] text-[#666666] dark:text-[#999999] hover:border-[#EF0029] hover:text-[#EF0029] bg-white dark:bg-[#1A1A1A]"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d) => (
            <motion.div
              key={d.id}
              variants={fadeInUp}
              className={`card-light p-5 cursor-pointer transition-all duration-200 ${selected?.id === d.id ? "border-[#EF0029]/50" : ""}`}
              style={selected?.id === d.id ? { backgroundColor: "rgba(239,0,41,0.02)" } : {}}
              onClick={() => setSelected(selected?.id === d.id ? null : d)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ borderRadius: "2px", backgroundColor: d.central ? "#EF0029" : "rgba(239,0,41,0.08)" }}
                >
                  <MapPin size={16} className={d.central ? "text-white" : "text-[#EF0029]"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[#111111] dark:text-[#F0F0F0] font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {d.nombre}
                    </h3>
                    {d.central && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#EF0029] text-white font-mono" style={{ borderRadius: "2px" }}>
                        {dp.central}
                      </span>
                    )}
                  </div>
                  <p className="text-[#888888] dark:text-[#AAAAAA] text-xs mb-1">{d.direccion}</p>
                  <p className="text-[#AAAAAA] dark:text-[#999999] text-xs font-mono mb-3">{d.cp} {d.ciudad}</p>
                  <div className="space-y-1.5">
                    <a href={`tel:${d.telefono.replace(/\s/g, "")}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-[#888888] dark:text-[#AAAAAA] hover:text-[#EF0029] text-xs transition-colors">
                      <Phone size={11} className="text-[#EF0029]" />
                      {d.telefono}
                    </a>
                    <a href={`mailto:${d.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-[#888888] dark:text-[#AAAAAA] hover:text-[#EF0029] text-xs transition-colors">
                      <Mail size={11} className="text-[#EF0029]" />
                      {d.email}
                    </a>
                    <div className="flex items-center gap-2 text-[#AAAAAA] dark:text-[#999999] text-xs">
                      <Clock size={11} className="text-[#CCCCCC] dark:text-[#AAAAAA]" />
                      {d.horario}
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} className={`text-[#CCCCCC] dark:text-[#AAAAAA] flex-shrink-0 mt-1 transition-transform ${selected?.id === d.id ? "rotate-90 text-[#EF0029]" : ""}`} />
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
