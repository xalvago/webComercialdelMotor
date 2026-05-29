"use client";

import { useEffect, useState } from "react";

interface Delegacion {
  id: string;
  nombre: string;
  region: string;
  direccion: string;
  cp: string;
  lat: number;
  lng: number;
  ciudad: string;
  telefono: string;
  email: string;
  horario: string;
  central: boolean;
}

interface Props {
  delegaciones: Delegacion[];
  selected?: Delegacion | null;
  onSelect: (d: Delegacion) => void;
}

export default function DelegacionesMap({ delegaciones, onSelect }: Props) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<Record<string, unknown>>;
    TileLayer: React.ComponentType<Record<string, unknown>>;
    Marker: React.ComponentType<Record<string, unknown>>;
    Popup: React.ComponentType<React.PropsWithChildren<Record<string, unknown>>>;
    useMap: () => unknown;
  } | null>(null);
  const [icons, setIcons] = useState<{ normal: unknown; central: unknown } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const leafletModule = await import("leaflet");
      const rl = await import("react-leaflet");

      const Leaflet = leafletModule.default;

      // Fix default icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const normalIcon = new Leaflet.DivIcon({
        className: "",
        html: `<div style="width:20px;height:20px;background:#EF0029;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 8px rgba(239,0,41,0.5)"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        popupAnchor: [0, -22],
      });

      const centralIconEl = new Leaflet.DivIcon({
        className: "",
        html: `<div style="width:26px;height:26px;background:#B30825;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 12px rgba(179,8,37,0.7)"></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [0, -28],
      });

      if (!mounted) return;

      setIcons({ normal: normalIcon, central: centralIconEl });
      setMapComponents({
        MapContainer: rl.MapContainer as unknown as React.ComponentType<Record<string, unknown>>,
        TileLayer: rl.TileLayer as unknown as React.ComponentType<Record<string, unknown>>,
        Marker: rl.Marker as unknown as React.ComponentType<Record<string, unknown>>,
        Popup: rl.Popup as unknown as React.ComponentType<React.PropsWithChildren<Record<string, unknown>>>,
        useMap: rl.useMap,
      });
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (!MapComponents || !icons) {
    return (
      <div className="h-96 bg-[#F4F4F4] dark:bg-[#1A1A1A] flex flex-col items-center justify-center gap-3 border border-[#EEEEEE] dark:border-[#2A2A2A]">
        <div className="flex gap-2">
          {delegaciones.map((d) => (
            <div
              key={d.id}
              className="w-2 h-2 bg-[#EF0029] rounded-full animate-pulse"
              style={{ animationDelay: `${Math.random() * 0.5}s` }}
            />
          ))}
        </div>
        <span className="text-[#CCCCCC] dark:text-[#888888] text-xs font-mono">Cargando mapa...</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="h-96 relative" style={{ zIndex: 1 }}>
      <style>{`
        .leaflet-container { background: #F4F4F4 !important; }
        .leaflet-tile { filter: grayscale(30%) brightness(0.95) saturate(0.7); }
        .leaflet-popup-content-wrapper {
          background: #fff;
          border: 1px solid #E8E8E8;
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          color: #111;
        }
        .leaflet-popup-tip { background: #fff; }
        .leaflet-popup-content { margin: 10px 14px; color: #111; }
        .leaflet-control-zoom a {
          background: #fff !important;
          color: #555 !important;
          border-color: #E8E8E8 !important;
        }
        .leaflet-control-zoom a:hover { background: #EF0029 !important; color: #fff !important; }
        .leaflet-control-attribution { background: rgba(255,255,255,0.8) !important; color: #AAAAAA !important; }
        .leaflet-control-attribution a { color: #999 !important; }

        /* Dark mode map */
        .dark .leaflet-container { background: #0A0A0A !important; }
        .dark .leaflet-tile { filter: grayscale(100%) brightness(0.28) saturate(0.1) invert(1); }
        .dark .leaflet-popup-content-wrapper {
          background: #1A1A1A;
          border: 1px solid #2A2A2A;
          color: #F0F0F0;
        }
        .dark .leaflet-popup-tip { background: #1A1A1A; }
        .dark .leaflet-popup-content { color: #F0F0F0; }
        .dark .leaflet-control-zoom a {
          background: #1A1A1A !important;
          color: #999 !important;
          border-color: #2A2A2A !important;
        }
        .dark .leaflet-control-zoom a:hover { background: #EF0029 !important; color: #fff !important; }
        .dark .leaflet-control-attribution { background: rgba(10,10,10,0.8) !important; color: #555 !important; }
        .dark .leaflet-control-attribution a { color: #777 !important; }
      `}</style>
      <MapContainer
        center={[40.4168, -3.7038] as [number, number]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
        />
        {delegaciones.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng] as [number, number]}
            icon={d.central ? icons.central : icons.normal}
            eventHandlers={{ click: () => onSelect(d) }}
          >
            <Popup>
              <div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  {d.nombre}
                </div>
                <div style={{ fontSize: 11, marginBottom: 2, opacity: 0.6 }}>
                  {d.ciudad}
                </div>
                <a
                  href={`tel:${d.telefono.replace(/\s/g, "")}`}
                  style={{ fontSize: 11, color: "#EF0029", textDecoration: "none" }}
                >
                  {d.telefono}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
