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
  Turismo:    "bg-[#EEF2FF] text-[#3B5BDB] border border-[#C5D8FF] dark:bg-[#1E2A4A] dark:text-[#74A7FF] dark:border-[#2D4080]",
  Industrial: "bg-[#FFF9F0] text-[#D97706] border border-[#FDD5A0] dark:bg-[#2A1E0A] dark:text-[#F5A742] dark:border-[#4A3015]",
  Agrícola:   "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] dark:bg-[#0A2A14] dark:text-[#4ADE80] dark:border-[#15532E]",
  Pesado:     "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] dark:bg-[#2A0A0A] dark:text-[#F87171] dark:border-[#7F1D1D]",
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
      <style>{`
        @keyframes cdm-pick {
          0%   { transform: translateY(0)   scale(1); }
          35%  { transform: translateY(-8px) scale(1.04); }
          100% { transform: translateY(-3px) scale(1); }
        }
        .cdm-card-picked {
          animation: cdm-pick 0.65s cubic-bezier(0.22,1,0.36,1) forwards;
          border-color: #EF0029 !important;
          box-shadow: 0 0 0 2px rgba(239,0,41,0.14), 0 16px 40px rgba(239,0,41,0.22) !important;
        }
        .cdm-product-card {
          transition:
            border-color 0.22s cubic-bezier(0.22,1,0.36,1),
            box-shadow   0.22s cubic-bezier(0.22,1,0.36,1),
            transform    0.22s cubic-bezier(0.22,1,0.36,1);
        }
        .cdm-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(239,0,41,0.10);
          border-color: rgba(239,0,41,0.35) !important;
        }
        .cdm-card-focused {
          box-shadow: 0 0 0 2px rgba(239,0,41,0.15), 0 12px 36px rgba(239,0,41,0.14) !important;
          border-color: rgba(239,0,41,0.35) !important;
        }
        .cdm-card-selected {
          box-shadow: 0 0 0 2px rgba(239,0,41,0.30), 0 16px 48px rgba(239,0,41,0.22) !important;
          border-color: #EF0029 !important;
        }
        /* card top accent line on hover/selected */
        .cdm-product-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: #EF0029;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
          border-radius: 4px 4px 0 0;
        }
        .cdm-product-card:hover::before,
        .cdm-card-selected::before,
        .cdm-card-focused::before {
          transform: scaleX(1);
        }

        /* Hero bg — dark mode aware */
        .cdm-hero-wrap {
          background: #f5f2eb;
        }
        .dark .cdm-hero-wrap {
          background: var(--bg);
        }
        /* Hero top gradient fade */
        .cdm-hero-top-fade {
          background: linear-gradient(to bottom, #f5f2eb 0%, rgba(245,242,235,0.55) 50%, transparent 100%);
        }
        .dark .cdm-hero-top-fade {
          background: linear-gradient(to bottom, #0A0A0A 0%, rgba(10,10,10,0.55) 50%, transparent 100%);
        }
        /* Hero bottom fade into catalog bg */
        .cdm-hero-bottom-fade {
          background: linear-gradient(to top, #FAFAFA 0%, rgba(250,250,250,0.7) 50%, transparent 100%);
        }
        .dark .cdm-hero-bottom-fade {
          background: linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.7) 50%, transparent 100%);
        }

        /* Search input */
        .cdm-search-input {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-primary);
          border-radius: 8px;
          width: 100%;
          font-size: 13px;
          padding: 12px 36px 12px 40px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .cdm-search-input::placeholder {
          color: var(--text-faint);
        }
        .cdm-search-input:focus {
          border-color: #EF0029;
        }

        /* Filter tipo pills */
        .cdm-filter-pill {
          padding: 6px 16px;
          font-size: 11px;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          border: 1px solid var(--border-strong);
          border-radius: 2px;
          background: var(--surface);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.05em;
        }
        .cdm-filter-pill:hover {
          border-color: #EF0029;
          color: #EF0029;
        }
        .cdm-filter-pill.active {
          background: #EF0029;
          border-color: #EF0029;
          color: #ffffff;
        }

        /* Sidebar item */
        .cdm-sidebar-item {
          width: 100%;
          text-align: left;
          padding: 7px 10px 7px 10px;
          font-size: 13px;
          font-family: 'Space Grotesk', sans-serif;
          background: transparent;
          border: none;
          border-left: 2px solid transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          transition: color 0.18s, background 0.18s, border-color 0.18s, padding-left 0.18s;
          border-radius: 0 3px 3px 0;
        }
        .cdm-sidebar-item:hover {
          color: #EF0029;
          background: rgba(239,0,41,0.04);
          border-left-color: rgba(239,0,41,0.4);
        }
        .cdm-sidebar-item.active {
          color: #EF0029;
          background: rgba(239,0,41,0.06);
          border-left-color: #EF0029;
          font-weight: 600;
        }
        .dark .cdm-sidebar-item:hover {
          background: rgba(239,0,41,0.08);
        }
        .dark .cdm-sidebar-item.active {
          background: rgba(239,0,41,0.10);
        }

        /* Sidebar divider */
        .cdm-sidebar-divider {
          border-color: var(--border);
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>

      <div className="cdm-hero-wrap min-h-screen">

        {/* HERO ============================================================ */}
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
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5"/>
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
              background: "radial-gradient(ellipse 70% 60% at 62% 45%, rgba(239,0,41,0.055) 0%, transparent 70%)",
            }}
          />

          {/* Top fade */}
          <div className="cdm-hero-top-fade absolute inset-x-0 top-0 pointer-events-none" style={{ zIndex: 2, height: "260px" }} />

          {/* Bottom fade */}
          <div className="cdm-hero-bottom-fade absolute inset-x-0 bottom-0 pointer-events-none" style={{ zIndex: 2, height: "180px" }} />

          {/* UI layer */}
          <div className="relative flex flex-col justify-start gap-8" style={{ zIndex: 10 }}>
            {/* Title block */}
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8" style={{ paddingTop: "112px" }}>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="section-label"
                style={{ marginBottom: "16px" }}
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
                  color: "var(--text-primary)",
                  fontSize: "clamp(1.875rem, 4vw, 2.25rem)",
                  margin: 0,
                }}
              >
                {p.h1_1}
                <br />
                <span style={{ color: "#EF0029" }}>{p.h1_2}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
                style={{
                  color: "var(--text-muted)",
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
                  <Search
                    size={15}
                    style={{
                      position: "absolute", left: "14px", top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-faint)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={p.searchPlaceholder}
                    className="cdm-search-input"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      style={{
                        position: "absolute", right: "12px", top: "50%",
                        transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--text-faint)", padding: 0,
                        display: "flex", alignItems: "center",
                      }}
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
                    className={`cdm-filter-pill${tipoFiltro === tipo ? " active" : ""}`}
                  >
                    {tipo}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CATALOG GRID ==================================================== */}
        <div style={{ background: "var(--bg)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8">

            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0 pr-6 cdm-sidebar-divider" style={{ borderRight: "1px solid var(--border)" }}>
              <div className="sticky top-24">
                <div
                  className="section-label"
                  style={{ marginBottom: "12px", paddingLeft: "10px" }}
                >
                  {p.categorias}
                </div>
                <div
                  style={{
                    height: "1px",
                    background: "var(--border)",
                    marginBottom: "8px",
                  }}
                />
                <nav style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  {productosData.map((prodRaw) => {
                    const prod = prodRaw as ProductoMl;
                    const prodNombre = mlField(prod as unknown as Record<string, string | undefined>, "nombre", lang);
                    const isActive = sidebarActive === prod.id || selectedProduct === prod.id;
                    return (
                      <button
                        key={prod.id}
                        onClick={() => {
                          setSidebarActive(sidebarActive === prod.id ? null : prod.id);
                          handleCardClick(prod.id);
                        }}
                        onMouseEnter={() => setHoveredProduct(prod.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                        className={`cdm-sidebar-item${isActive ? " active" : ""}`}
                      >
                        <ChevronRight
                          size={10}
                          style={{
                            flexShrink: 0,
                            color: isActive ? "#EF0029" : "var(--text-faint)",
                            transform: isActive ? "rotate(90deg)" : "none",
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
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  marginBottom: "20px",
                  letterSpacing: "0.04em",
                }}
              >
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
                            background: "var(--surface)",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          onClick={() => handleCardClick(producto.id)}
                          onMouseEnter={() => setHoveredProduct(producto.id)}
                          onMouseLeave={() => setHoveredProduct(null)}
                        >
                          {/* Subtle gradient wash top-right */}
                          <div
                            aria-hidden
                            style={{
                              position: "absolute",
                              top: 0, right: 0,
                              width: "80px", height: "80px",
                              background: isSelected
                                ? "radial-gradient(circle at top right, rgba(239,0,41,0.08) 0%, transparent 70%)"
                                : "radial-gradient(circle at top right, rgba(239,0,41,0.035) 0%, transparent 70%)",
                              pointerEvents: "none",
                              transition: "background 0.3s",
                            }}
                          />

                          {/* Icon + PDF */}
                          <div className="flex items-start justify-between mb-4">
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "6px",
                                backgroundColor: isSelected
                                  ? "rgba(239,0,41,0.12)"
                                  : "rgba(239,0,41,0.07)",
                                flexShrink: 0,
                                transition: "background-color 0.25s",
                                border: "1px solid rgba(239,0,41,0.12)",
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
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  color: "var(--text-faint)",
                                  fontSize: "11px",
                                  fontFamily: "'JetBrains Mono', monospace",
                                  textDecoration: "none",
                                  transition: "color 0.18s",
                                }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#EF0029")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-faint)")}
                              >
                                <FileText size={12} />
                                {p.catalogoPDF}
                              </a>
                            )}
                          </div>

                          {/* Name */}
                          <h3
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 700,
                              fontSize: "15px",
                              color: isHovered || isSelected ? "#EF0029" : "var(--text-primary)",
                              marginBottom: "6px",
                              lineHeight: 1.3,
                              transition: "color 0.18s",
                            }}
                          >
                            {nombre}
                          </h3>

                          {/* Description */}
                          <p
                            style={{
                              color: "var(--text-muted)",
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
                                  const tipoMap: Record<string, string> = {
                                    "Turismo":    p.tipos.turismo,
                                    "Industrial": p.tipos.industrial,
                                    "Agrícola":   p.tipos.agricola,
                                    "Pesado":     p.tipos.pesado,
                                  };
                                  setTipoFiltro(tipoMap[tipo] ?? tipo);
                                }}
                                className={`text-[10px] px-2 py-0.5 font-mono uppercase tracking-wide transition-all hover:opacity-80 ${
                                  tipoColors[tipo] || "bg-[#F5F5F5] text-[#888888] border border-[#E8E8E8] dark:bg-[#2A2A2A] dark:text-[#999999] dark:border-[#3A3A3A]"
                                }`}
                                style={{ borderRadius: "3px" }}
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
                    <Search
                      size={40}
                      style={{
                        margin: "0 auto 16px",
                        color: "var(--text-faint)",
                        opacity: 0.5,
                        display: "block",
                      }}
                    />
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
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
