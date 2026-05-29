"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { FadeInUp } from "@/components/animations";
import { useLanguage } from "@/lib/i18n";

export default function ContactoPage() {
  const { t } = useLanguage();
  const c = t.contactoPage;

  const [form, setForm] = useState({ nombre: "", empresa: "", email: "", telefono: "", asunto: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  }

  const contactInfo = [
    { icon: Phone, label: c.telLabel,   value: "+34 91 710 99 40",             href: "tel:+34917109940" },
    { icon: Mail,  label: c.emailLabel, value: "info@comercialdelmotor.com",    href: "mailto:info@comercialdelmotor.com" },
    { icon: MapPin, label: c.oficina,   value: "Avda. Andalucía Km. 10,5, Pol. Neisa Sur — Madrid", href: null },
    { icon: Clock,  label: c.horario,   value: c.horarioVal,                    href: null },
  ];

  const inputClass = "w-full bg-white/15 border border-white/20 text-white placeholder-white/40 text-sm px-4 py-3 focus:outline-none focus:border-[#EF0029] transition-colors";

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] pt-14">
      {/* Wrapper unificado con video de fondo */}
      <div className="relative overflow-hidden">
        {/* Video fondo */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
          <video
            src="/video/contacto.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              minWidth: "100%",
              minHeight: "100%",
              width: "auto",
              height: "auto",
              transform: "translate(-50%, -50%)",
              objectFit: "cover",
            }}
          />
        </div>
        {/* Overlay oscuro general */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(0,0,0,0.52)" }} />

        {/* Header */}
        <div className="py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <FadeInUp>
              <div className="max-w-xl">
                <div className="section-label mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>{c.eyebrow}</div>
                <h1 className="section-title" style={{ color: "#FFFFFF" }}>
                  {c.h1_1} <span className="text-[#EF0029]">{c.h1_2}</span>
                </h1>
                <div className="red-line mt-3 mb-3" />
                <p className="text-sm max-w-md" style={{ color: "rgba(255,255,255,0.75)" }}>{c.subtitle}</p>
              </div>
            </FadeInUp>
          </div>
        </div>

        {/* Contenido: info + formulario */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact info */}
            <FadeInUp className="lg:col-span-2">
              <div className="space-y-6">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ borderRadius: "2px", backgroundColor: "rgba(239,0,41,0.18)" }}>
                        <Icon size={18} className="text-[#EF0029]" />
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} className="hover:text-[#EF0029] text-sm transition-colors" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Space Grotesk', sans-serif" }}>
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 p-5 border border-white/15" style={{ borderRadius: "4px", background: "rgba(255,255,255,0.06)" }}>
                <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>{c.redAlmacenes}</div>
                <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>{c.redDesc}</p>
                <a href="/delegaciones" className="text-[#EF0029] text-sm font-medium hover:underline" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {c.verMapa}
                </a>
              </div>
            </FadeInUp>

            {/* Form */}
            <FadeInUp delay={0.15} className="lg:col-span-3">
              <div className="p-8" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px" }}>
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: "50%" }}>
                      <CheckCircle size={28} className="text-green-500" />
                    </div>
                    <h3 className="text-[#111111] dark:text-[#F0F0F0] text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{c.successTitle}</h3>
                    <p className="text-[#777777] dark:text-[#AAAAAA] text-sm">{c.successDesc}</p>
                    <button
                      onClick={() => { setStatus("idle"); setForm({ nombre: "", empresa: "", email: "", telefono: "", asunto: "", mensaje: "" }); }}
                      className="mt-6 text-[#EF0029] text-sm hover:underline"
                    >
                      {c.successBtn}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{c.nombreLabel}</label>
                        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder={c.nombrePlaceholder} required className={inputClass} style={{ borderRadius: "2px" }} />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{c.empresaLabel}</label>
                        <input type="text" name="empresa" value={form.empresa} onChange={handleChange} placeholder={c.empresaPlaceholder} className={inputClass} style={{ borderRadius: "2px" }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{c.emailFormLabel}</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={c.emailPlaceholder} required className={inputClass} style={{ borderRadius: "2px" }} />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{c.telefonoLabel}</label>
                        <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder={c.telefonoPlaceholder} className={inputClass} style={{ borderRadius: "2px" }} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{c.asuntoLabel}</label>
                      <select name="asunto" value={form.asunto} onChange={handleChange} required className={inputClass} style={{ borderRadius: "2px" }}>
                        <option value="" disabled style={{ background: "#1a1a1a", color: "#aaa" }}>{c.asuntoDefault}</option>
                        <option value="consulta-producto" style={{ background: "#1a1a1a", color: "#fff" }}>{c.asunto1}</option>
                        <option value="pedido" style={{ background: "#1a1a1a", color: "#fff" }}>{c.asunto2}</option>
                        <option value="distribuidor" style={{ background: "#1a1a1a", color: "#fff" }}>{c.asunto3}</option>
                        <option value="tecnico" style={{ background: "#1a1a1a", color: "#fff" }}>{c.asunto4}</option>
                        <option value="otro" style={{ background: "#1a1a1a", color: "#fff" }}>{c.asunto5}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{c.mensajeLabel}</label>
                      <textarea name="mensaje" value={form.mensaje} onChange={handleChange} placeholder={c.mensajePlaceholder} required rows={5} className={inputClass + " resize-none"} style={{ borderRadius: "2px" }} />
                    </div>

                    <button type="submit" disabled={status === "sending"} className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                      {status === "sending" ? (
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                          {c.enviando}
                        </motion.span>
                      ) : (
                        <><Send size={16} />{c.enviar}</>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeInUp>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
