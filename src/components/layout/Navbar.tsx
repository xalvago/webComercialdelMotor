"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useLanguage, type Lang } from "@/lib/i18n";

const NAV_HREFS = [
  "/",
  "/productos",
  "/noticias",
  "/videos",
  "/calidad",
  "/delegaciones",
  "/contacto",
] as const;

const IDIOMAS: { code: Lang; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const navLabels = [
    t.nav.inicio,
    t.nav.productos,
    t.nav.noticias,
    t.nav.videos,
    t.nav.calidad,
    t.nav.delegaciones,
    t.nav.contacto,
  ];

  const navLinks = NAV_HREFS.map((href, i) => ({ href, label: navLabels[i] }));

  const isHeroPage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navBg =
    isHeroPage && !scrolled
      ? "bg-transparent"
      : "bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#E8E8E8] dark:border-[#2A2A2A] shadow-sm dark:shadow-black/30";

  const linkInactive =
    isHeroPage && !scrolled
      ? "text-white/70 hover:text-white"
      : "text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white";
  const langColor =
    isHeroPage && !scrolled
      ? "text-white/50 hover:text-white"
      : "text-[#999999] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white";
  const toggleColor =
    isHeroPage && !scrolled
      ? "text-white/70 hover:text-white"
      : "text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white";

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo_comercial_web.png"
                alt="Comercial del Motor"
                width={160}
                height={54}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? isHeroPage && !scrolled
                          ? "text-white"
                          : "text-[#111111] dark:text-[#F0F0F0]"
                        : linkInactive
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className={`absolute inset-0 rounded-sm ${
                          isHeroPage && !scrolled
                            ? "bg-white/10"
                            : "bg-[#EF0029]/5 dark:bg-[#EF0029]/10"
                        }`}
                      />
                    )}
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-4 right-4 h-px bg-[#EF0029]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: theme toggle + lang + mobile */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggle}
                className={`flex items-center justify-center w-8 h-8 transition-colors duration-200 ${toggleColor}`}
                aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Language selector */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-1 text-xs font-mono transition-colors duration-200 ${langColor}`}
                >
                  <Globe size={14} />
                  {lang.toUpperCase()}
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full right-0 mt-2 bg-white dark:bg-[#1A1A1A] border border-[#E8E8E8] dark:border-[#2A2A2A] shadow-lg rounded py-1 w-16"
                    >
                      {IDIOMAS.map((idioma) => (
                        <button
                          key={idioma.code}
                          onClick={() => {
                            setLang(idioma.code);
                            setLangOpen(false);
                          }}
                          className={`w-full text-center py-1.5 text-xs font-mono transition-colors ${
                            lang === idioma.code
                              ? "text-[#EF0029]"
                              : "text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white"
                          }`}
                        >
                          {idioma.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile toggle */}
              <button
                className={`lg:hidden transition-colors ${
                  isHeroPage && !scrolled
                    ? "text-white/70 hover:text-white"
                    : "text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white"
                }`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menú"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white dark:bg-[#0A0A0A] flex flex-col pt-20 px-6 shadow-xl"
          >
            <nav className="flex flex-col gap-1 mt-4">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between py-4 border-b border-[#F0F0F0] dark:border-[#1A1A1A] text-lg font-medium transition-colors ${
                        active
                          ? "text-[#EF0029]"
                          : "text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white"
                      }`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {link.label}
                      {active && <span className="w-2 h-2 bg-[#EF0029] rounded-full" />}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-4">
                {IDIOMAS.map((idioma) => (
                  <button
                    key={idioma.code}
                    onClick={() => setLang(idioma.code)}
                    className={`text-sm font-mono transition-colors ${
                      lang === idioma.code
                        ? "text-[#EF0029]"
                        : "text-[#BBBBBB] dark:text-[#888888] hover:text-[#111111] dark:hover:text-white"
                    }`}
                  >
                    {idioma.label}
                  </button>
                ))}
              </div>
              <button
                onClick={toggle}
                className="text-[#555555] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white transition-colors"
                aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
