"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, ChevronRight, X } from "lucide-react";
import { Stagger, fadeInUp } from "@/components/animations";
import SceneErrorBoundary from "@/components/spatial/SceneErrorBoundary";
import productosData from "@/lib/data/productos.json";
import { useLanguage, type Lang } from "@/lib/i18n";

type ProductoMl = (typeof productosData)[0] & {
  nombre_en?: string; nombre_fr?: string;
  descripcion_en?: string; descripcion_fr?: string;
};

function mlField(obj: Record<string, string | undefined>, field: string, lang: Lang): string {
  if (lang !== "es") { const v = obj[`${field}_${lang}`]; if (v) return v; }
  return obj[field] ?? "";
}

// SSR=false — WebGL canvas
const SpatialScene = dynamic(
  () => import("@/components/spatial/SpatialScene"),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: "100%", height: "100%", background: "transparent" }} />
    ),
  }
);

const EASE = [0.22, 1, 0.36, 1] as const;

const productoIconos: Record<string, string> = {
  "pistones":           "/icons/01_pistones.svg",
  "camisas":            "/icons/02_camisas.svg",
  "cigüenales":         "/icons/03_ciguenales.svg",
  "culatas":            "/icons/04_culatas.svg",
  "kits-distribucion":  "/icons/05_kits_distribucion.svg",
  "turbos":             "/icons/06_turbos.svg",
  "juntas-motor":       "/icons/07_juntas_motor.svg",
  "cojinetes":          "/icons/08_cojinetes.svg",
  "arboles-levas":      "/icons/09_arboles_levas.svg",
  "bielas":             "/icons/10_bielas.svg",
  "anillos":            "/icons/11_segmentos_aros.svg",
  "valvulas":           "/icons/12_valvulas.svg",
  "bombas-agua":        "/icons/13_bombas_agua.svg",
  "bombas-aceite":      "/icons/14_bombas_aceite.svg",
  "enfriadores-aceite": "/icons/15_enfriadores_aceite.svg",
  "filtros":            "/icons/16_filtros.svg",
  "inyectores":         "/icons/17_inyectores.svg",
  "bombas-inyeccion":   "/icons/18_bombas_inyeccion.svg",
  "motores-completos":  "/icons/19_motores_completos.svg",
  "alternadores":       "/icons/20_alternadores.svg",
  "motores-arranque":   "/icons/21_motores_arranque.svg",
  "correas":            "/icons/22_correas_distribucion.svg",
  "radiadores":         "/icons/23_radiadores.svg",
  "intercoolers":       "/icons/24_intercoolers.svg",
  "electrovalvulas":    "/icons/25_electrovalvulas_sensores.svg",
};

const RED_FILTER =
  "brightness(0) saturate(100%) invert(13%) sepia(94%) saturate(6029%) hue-rotate(345deg) brightness(96%) contrast(104%)";

const tipoColors: Record<string, string> = {
  Turismo:    "bg-[#f0f4ff] text-[#1a56c4] border border-[#b8d0f8]",
  Industrial: "bg-[#fffaf0] text-[#b45309] border border-[#f8d8a0]",
  Agrícola:   "bg-[#f0f8f0] text-[#2e7d32] border border-[#a8d8aa]",
  Pesado:     "bg-[#fff0f0] text-[#c62828] border border-[#f8b8b8]",
};

export default function ProductosPage() {
  const { t, lang } = useLanguage();
  const p = t.productosPage;

  const TIPO_DISPLAY: Record<string, string> = {
    "Turismo":    p.tipos.turismo,
    "Industrial": p.tipos.industrial,
    "Agrícola":   p.tipos.agricola,
    "Pesado":     p.tipos.pesado,
  };

  const TIPOS = [
    p.tipos.todos,
    p.tipos.turismo,
    p.tipos.industrial,
    p.tipos.agricola,
    p.tipos.pesado,
  ];

  // Map translated tipo labels back to original data keys for filtering
  const TIPO_KEY: Record<string, string> = {
    [p.tipos.todos]:       "Todos",
    [p.tipos.turismo]:     "Turismo",
    [p.tipos.industrial]:  "Industrial",
    [p.tipos.agricola]:    "Agrícola",
    [p.tipos.pesado]:      "Pesado",
  };

  const [search, setSearch]                   = useState("");
  const [tipoFiltro, setTipoFiltro]           = useState<string>(p.tipos.todos);
  const [sidebarActive, setSidebarActive]     = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct]   = useState<string | null>(null);
  const [pickedCardId, setPickedCardId]       = useState<string | null>(null);

  const tipoKey = TIPO_KEY[tipoFiltro] ?? "Todos";

  const filtered = useMemo(() => {
    return productosData.filter((prod) => {
      const matchSearch =
        search === "" ||
        prod.nombre.toLowerCase().includes(search.toLowerCase()) ||
        prod.descripcion.toLowerCase().includes(search.toLowerCase());
      const matchTipo = tipoKey === "Todos" || prod.tipos.includes(tipoKey);
      return matchSearch && matchTipo;
    });
  }, [search, tipoKey]);

  const handleCardClick = useCallback((id: string) => {
    setSelectedProduct((prev) => (prev === id ? null : id));
    setPickedCardId(id);
    setTimeout(() => setPickedCardId(null), 700);
  }, []);

  const countLabel =
    filtered.length === 1
      ? `1 ${p.resultado}`
      : `${filtered.length} ${p.resultados}`;

  return (
    <>
      {/* ─── CSS ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes cdm-pick {
          0%   { transform: translateY(0)   scale(1); }
          35%  { transform: translateY(-8px) scale(1.04); }
          100% { transform: translateY(-3px) scale(1); }
        }
        .cdm-card-picked {
          animation: cdm-pick 0.65s cubic-bezier(0.22,1,0.36,1) forwards;
          border-color: #e02020 !important;
          box-shadow: 0 0 0 2px rgba(224,32,32,0.14), 0 16px 40px rgba(224,32,32,0.22) !important;
        }
        .cdm-product-card {
          transition:
            border-color 0.22s cubic-bezier(0.22,1,0.36,1),
            box-shadow   0.22s cubic-bezier(0.22,1,0.36,1),
            transform    0.22s cubic-bezier(0.22,1,0.36,1);
        }
        .cdm-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(224,32,32,0.10);
          border-color: #e8b0b0 !important;
        }
        .cdm-card-focused {
          box-shadow: 0 0 0 2px rgba(224,32,32,0.2), 0 12px 36px rgba(224,32,32,0.18) !important;
          border-color: rgba(224,32,32,0.45) !important;
        }
        .cdm-card-selected {
          box-shadow: 0 0 0 2px rgba(224,32,32,0.35), 0 16px 48px rgba(224,32,32,0.28) !important;
          border-color: #e02020 !important;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>

      <div className="min-h-screen" style={{ background: "#f5f2eb" }}>

        {/* ═══════════════════════════════════════════════════════════════
            SPATIAL HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: "58vh" }}>
          {/* R3F Canvas */}
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            <SceneErrorBoundary>
              <SpatialScene
                hoveredProduct={hoveredProduct}
                selectedProduct={selectedProduct}
                searchQuery={search}
              />
            </SceneErrorBoundary>
          </div>

          {/* Technical grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.025 }}>
              <defs>
                <pattern id="techgrid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#6b5a40" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#techgrid)"/>
            </svg>
          </div>

          {/* Red radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              background: "radial-gradient(ellipse 70% 60% at 62% 45%, rgba(224,32,32,0.055) 0%, transparent 70%)",
            }}
          />

          {/* Top fade */}
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              zIndex: 2,
              height: "260px",
              background: "linear-gradient(to bottom, rgba(248,245,239,0.96) 0%, rgba(248,245,239,0.55) 50%, transparent 100%)",
            }}
          />

          {/* Bottom fade — dissolves into card section white */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              zIndex: 2,
              height: "180px",
              background: "linear-gradient(to top, #fafafa 0%, rgba(250,250,250,0.7) 50%, transparent 100%)",
            }}
          />

          {/* UI layer */}
          <div className="relative flex flex-col justify-start gap-8" style={{ zIndex: 10 }}>
            {/* Title block */}
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8" style={{ paddingTop: "112px" }}>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{
                  color: "#e02020",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  marginBottom: "16px",
                }}
              >
                {p.eyebrow}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: "#111111",
                  fontSize: "clamp(1.875rem, 4vw, 2.25rem)",
                  margin: 0,
                }}
              >
                {p.h1_1}
                <br />
                <span style={{ color: "#e02020" }}>{p.h1_2}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
                style={{
                  color: "#888888",
                  fontSize: "13px",
                  marginTop: "16px",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  lineHeight: 1.6,
                }}
              >
                {p.subline1}
                <br />
                {p.subline2}
              </motion.p>
            </div>

            {/* Search + filters */}
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8" style={{ paddingBottom: "40px" }}>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
                style={{ maxWidth: "520px", marginBottom: "14px" }}
              >
                <div style={{ position: "relative" }}>
                  <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#BBBBBB", pointerEvents: "none" }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={p.searchPlaceholder}
                    style={{
                      width: "100%",
                      border: "1px solid #e0ddd5",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      color: "#111111",
                      fontSize: "13px",
                      padding: "12px 36px 12px 40px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#e02020")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0ddd5")}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#BBBBBB", padding: 0, display: "flex", alignItems: "center" }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
              >
                {TIPOS.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setTipoFiltro(tipo)}
                    style={{
                      padding: "6px 16px",
                      fontSize: "11px",
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      border: tipoFiltro === tipo ? "1px solid #e02020" : "1px solid #d8d4cc",
                      borderRadius: "6px",
                      background: tipoFiltro === tipo ? "#e02020" : "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(8px)",
                      color: tipoFiltro === tipo ? "#ffffff" : "#555555",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (tipoFiltro !== tipo) {
                        (e.target as HTMLButtonElement).style.borderColor = "#e02020";
                        (e.target as HTMLButtonElement).style.color = "#e02020";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (tipoFiltro !== tipo) {
                        (e.target as HTMLButtonElement).style.borderColor = "#d8d4cc";
                        (e.target as HTMLButtonElement).style.color = "#555555";
                      }
                    }}
                  >
                    {tipo}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CATALOG GRID
        ═══════════════════════════════════════════════════════════════ */}
        <div style={{ background: "#FAFAFA" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8">

            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0 pr-6" style={{ borderRight: "1px solid #eeebe4" }}>
              <div className="sticky top-24">
                <div style={{ color: "#e02020", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.22em", fontFamily: "'JetBrains Mono', 'Courier New', monospace", marginBottom: "16px" }}>
                  {p.categorias}
                </div>
                <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {productosData.map((prodRaw) => {
                    const prod = prodRaw as ProductoMl;
                    const prodNombre = mlField(prod as unknown as Record<string, string | undefined>, "nombre", lang);
                    return (
                    <button
                      key={prod.id}
                      onClick={() => {
                        setSidebarActive(sidebarActive === prod.id ? null : prod.id);
                        handleCardClick(prod.id);
                      }}
                      onMouseEnter={() => setHoveredProduct(prod.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px",
                        fontSize: "14px",
                        fontFamily: "'Space Grotesk', sans-serif",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: (sidebarActive === prod.id || selectedProduct === prod.id) ? "#e02020" : "#666666",
                        transition: "color 0.2s",
                      }}
                      onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#e02020")}
                      onMouseOut={(e) => {
                        if (sidebarActive !== prod.id && selectedProduct !== prod.id) {
                          (e.currentTarget as HTMLButtonElement).style.color = "#666666";
                        }
                      }}
                    >
                      <ChevronRight
                        size={11}
                        style={{
                          flexShrink: 0,
                          color: (sidebarActive === prod.id || selectedProduct === prod.id) ? "#e02020" : "#CCCCCC",
                          transform: (sidebarActive === prod.id || selectedProduct === prod.id) ? "rotate(90deg)" : "none",
                          transition: "transform 0.2s, color 0.2s",
                        }}
                      />
                      {prodNombre}
                    </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main column */}
            <div className="flex-1 min-w-0">
              {/* Results count */}
              <div style={{ color: "#AAAAAA", fontSize: "11px", fontFamily: "'JetBrains Mono', 'Courier New', monospace", marginBottom: "20px" }}>
                {countLabel}
                {tipoFiltro !== p.tipos.todos && ` · ${tipoFiltro}`}
                {search && ` · "${search}"`}

              </div>

              {/* Cards */}
              <AnimatePresence mode="wait">
                {filtered.length > 0 ? (
                  <Stagger key="results" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((productoRaw) => {
                      const producto = productoRaw as ProductoMl;
                      const nombre = mlField(producto as unknown as Record<string, string | undefined>, "nombre", lang);
                      const descripcion = mlField(producto as unknown as Record<string, string | undefined>, "descripcion", lang);
                      const isHovered  = hoveredProduct === producto.id;
                      const isSelected = selectedProduct === producto.id;
                      const isPicked   = pickedCardId === producto.id;

                      return (
                        <motion.div
                          key={producto.id}
                          variants={fadeInUp}
                          layout
                          className={[
                            "cdm-product-card group cursor-pointer",
                            isPicked   ? "cdm-card-picked"   : "",
                            isSelected ? "cdm-card-selected" : "",
                            isHovered && !isSelected ? "cdm-card-focused" : "",
                          ].join(" ")}
                          style={{
                            background: "#ffffff",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid #ebebeb",
                            borderRadius: "12px",
                          }}
                          onClick={() => handleCardClick(producto.id)}
                          onMouseEnter={() => setHoveredProduct(producto.id)}
                          onMouseLeave={() => setHoveredProduct(null)}
                        >
                          {/* Icon + PDF */}
                          <div className="flex items-start justify-between mb-4">
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "8px",
                                backgroundColor: isSelected ? "rgba(224,32,32,0.12)" : "#fff0f0",
                                flexShrink: 0,
                                transition: "background-color 0.3s",
                              }}
                            >
                              <Image
                                src={productoIconos[producto.id] ?? "/icons/01_pistones.svg"}
                                alt={producto.nombre}
                                width={22}
                                height={22}
                                style={{ filter: RED_FILTER }}
                                unoptimized
                              />
                            </div>
                            {producto.pdf && (
                              <a
                                href={producto.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-[#aaaaaa] hover:text-[#e02020] text-xs font-mono transition-colors"
                              >
                                <FileText size={12} />
                                {p.catalogoPDF}
                              </a>
                            )}
                          </div>

                          {/* Name */}
                          <h3
                            className="group-hover:text-[#e02020] transition-colors"
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 700,
                              fontSize: "15px",
                              color: "#111111",
                              marginBottom: "6px",
                              lineHeight: 1.3,
                            }}
                          >
                            {nombre}
                          </h3>

                          {/* Description */}
                          <p
                            style={{
                              color: "#aaaaaa",
                              fontSize: "12px",
                              lineHeight: 1.6,
                              marginBottom: "16px",
                              flex: 1,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {descripcion}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {producto.tipos.map((tipo) => (
                              <button
                                key={tipo}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Map raw data tipo to translated label
                                  const tipoMap: Record<string, string> = {
                                    "Turismo":    p.tipos.turismo,
                                    "Industrial": p.tipos.industrial,
                                    "Agrícola":   p.tipos.agricola,
                                    "Pesado":     p.tipos.pesado,
                                  };
                                  setTipoFiltro(tipoMap[tipo] ?? tipo);
                                }}
                                className={`text-[10px] px-2 py-0.5 font-mono uppercase tracking-wide transition-colors ${
                                  tipoColors[tipo] || "bg-[#F5F5F5] text-[#888888] border border-[#EEEEEE]"
                                }`}
                                style={{ borderRadius: "4px" }}
                              >
                                {TIPO_DISPLAY[tipo] ?? tipo}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </Stagger>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: "center", paddingTop: "80px", paddingBottom: "80px" }}
                  >
                    <Search size={40} style={{ margin: "0 auto 16px", color: "#CCCCCC", opacity: 0.5, display: "block" }} />
                    <p style={{ color: "#888888", fontFamily: "'Space Grotesk', sans-serif" }}>
                      {p.sinResultados} &quot;{search}&quot;
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
