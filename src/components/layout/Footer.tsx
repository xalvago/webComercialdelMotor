"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const NAV_HREFS = [
  "/",
  "/productos",
  "/noticias",
  "/videos",
  "/calidad",
  "/delegaciones",
  "/contacto",
] as const;

const LEGAL_HREFS = ["/aviso-legal", "/privacidad", "/cookies"] as const;

const DELEGACIONES_NAMES = [
  "Madrid",
  "Cataluña",
  "Valencia",
  "País Vasco",
  "Galicia",
  "Andalucía",
  "Canarias",
];

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;
  const n = t.nav;

  const navLinks = [
    { href: NAV_HREFS[0], label: n.inicio },
    { href: NAV_HREFS[1], label: n.productos },
    { href: NAV_HREFS[2], label: n.noticias },
    { href: NAV_HREFS[3], label: n.videos },
    { href: NAV_HREFS[4], label: n.calidad },
    { href: NAV_HREFS[5], label: n.delegaciones },
    { href: NAV_HREFS[6], label: n.contacto },
  ];

  const legal = [
    { href: LEGAL_HREFS[0], label: f.legal },
    { href: LEGAL_HREFS[1], label: f.privacidad },
    { href: LEGAL_HREFS[2], label: f.cookies },
  ];

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      {/* Red line accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#EF0029] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[#EF0029]" />
              <div>
                <div
                  className="text-white font-bold text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Comercial del Motor
                </div>
                <div className="text-white/30 text-[10px] tracking-widest uppercase font-mono">
                  {f.desde}
                </div>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mt-4">
              {f.desc}
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { label: "Facebook", abbr: "Fb", href: "https://www.facebook.com/p/Comercial-del-Motor-100070100160405/" },
                { label: "Twitter / X", abbr: "X", href: "https://x.com/comerc_delmotor" },
              ].map(({ label, abbr, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[#EF0029] transition-all duration-200 text-xs font-mono"
                  style={{ borderRadius: "2px" }}
                >
                  {abbr}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4
              className="text-white text-xs uppercase tracking-widest mb-6 font-mono"
              style={{ color: "#EF0029" }}
            >
              {f.navegacion}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1 group"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#EF0029] transition-all duration-200 overflow-hidden" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Delegaciones */}
          <div>
            <h4
              className="text-xs uppercase tracking-widest mb-6 font-mono"
              style={{ color: "#EF0029" }}
            >
              {f.delegaciones}
            </h4>
            <ul className="space-y-2 text-white/50 text-sm">
              {DELEGACIONES_NAMES.map((d) => (
                <li key={d}>
                  <Link
                    href="/delegaciones"
                    className="hover:text-white transition-colors duration-200"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contacto */}
          <div>
            <h4
              className="text-xs uppercase tracking-widest mb-6 font-mono"
              style={{ color: "#EF0029" }}
            >
              {f.contacto}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#EF0029] mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm leading-relaxed">
                  Avda. Andalucía Km. 10,5<br />
                  Pol. Neisa Sur, Madrid
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#EF0029] flex-shrink-0" />
                <a
                  href="tel:+34917109940"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  +34 91 710 99 40
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#EF0029] flex-shrink-0" />
                <a
                  href="mailto:info@comercialdelmotor.com"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  info@comercialdelmotor.com
                </a>
              </li>
            </ul>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 mt-6 text-[#EF0029] text-sm font-medium hover:gap-3 transition-all duration-200"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {f.formulario}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-mono">
            © {new Date().getFullYear()} Comercial del Motor S.A. {f.derechos}
          </p>
          <div className="flex gap-6">
            {legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/25 hover:text-white/60 text-xs transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
