import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Crosshair, Plus, Minus, Navigation, Star, Phone, Stethoscope } from "lucide-react";

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  image?: string;
  rating?: number;
  phone?: string;
}

interface InteractiveMapContainerProps {
  center?: { lat: number; lng: number };
  zoom?: number; // logical zoom (1 = world, higher = closer)
  markers?: MapMarkerData[];
  className?: string;
  style?: React.CSSProperties;
}

// Basic Web Mercator helpers (no tiles)
function lon2x(lon: number): number {
  return (lon + 180) / 360; // 0..1
}
function lat2y(lat: number): number {
  const rad = (lat * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + rad / 2));
  return 0.5 - y / (2 * Math.PI); // 0..1
}

export default function InteractiveMapContainer({
  center = { lat: 33.3152, lng: 44.3661 }, // Baghdad
  zoom = 3,
  markers,
  className,
  style,
}: InteractiveMapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(() => Math.pow(2, zoom));
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [activeMarker, setActiveMarker] = useState<MapMarkerData | null>(null);
  const lastTouchDist = useRef<number | null>(null);

  // Default demo markers around center if none provided
  const demoMarkers = useMemo<MapMarkerData[]>(() => {
    const base = { lat: center.lat, lng: center.lng };
    const deltas = [
      { lat: 0.02, lng: 0.02 },
      { lat: -0.015, lng: 0.018 },
      { lat: 0.01, lng: -0.02 },
      { lat: -0.02, lng: -0.015 },
      { lat: 0.025, lng: 0 },
      { lat: -0.01, lng: 0.012 },
    ];
    return deltas.map((d, i) => ({
      id: String(i + 1),
      lat: base.lat + d.lat,
      lng: base.lng + d.lng,
      title: `عيادة قريبة #${i + 1}`,
      subtitle: "خدمات الأسنان",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      rating: 4.6 - (i % 3) * 0.2,
      phone: "+964 770 123 45" + (60 + i),
    }));
  }, [center.lat, center.lng]);

  const allMarkers = markers && markers.length > 0 ? markers : demoMarkers;

  // Center the map initially
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const cx = container.clientWidth / 2;
    const cy = container.clientHeight / 2;

    // Position world so that center lat/lng goes to the middle
    const worldSize = 1024; // arbitrary logical world size
    const centerX = lon2x(center.lng) * worldSize;
    const centerY = lat2y(center.lat) * worldSize;

    setTranslate({ x: cx - centerX * scale, y: cy - centerY * scale });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel zoom
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current || !contentRef.current) return;

    const delta = -e.deltaY;
    const zoomIntensity = 0.0015;
    const newScale = clamp(scale * (1 + delta * zoomIntensity), 0.5, 8);

    // Zoom towards mouse position
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const sx = mx - translate.x;
    const sy = my - translate.y;
    const k = newScale / scale;

    setTranslate({ x: mx - sx * k, y: my - sy * k });
    setScale(newScale);
  };

  // Mouse pan
  const onMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    startRef.current = { x: e.clientX - translate.x, y: e.clientY - translate.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !startRef.current) return;
    setTranslate({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
  };
  const onMouseUp = () => {
    setIsPanning(false);
    startRef.current = null;
  };

  // Touch pan + pinch zoom
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      startRef.current = { x: t.clientX - translate.x, y: t.clientY - translate.y };
    } else if (e.touches.length === 2) {
      lastTouchDist.current = touchDist(e.touches[0], e.touches[1]);
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && startRef.current) {
      const t = e.touches[0];
      setTranslate({ x: t.clientX - startRef.current.x, y: t.clientY - startRef.current.y });
    } else if (e.touches.length === 2 && lastTouchDist.current) {
      const d = touchDist(e.touches[0], e.touches[1]);
      const factor = d / lastTouchDist.current;
      lastTouchDist.current = d;
      const rect = containerRef.current!.getBoundingClientRect();
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
      const sx = mx - translate.x;
      const sy = my - translate.y;
      const newScale = clamp(scale * factor, 0.5, 8);
      const k = newScale / scale;
      setTranslate({ x: mx - sx * k, y: my - sy * k });
      setScale(newScale);
    }
  };
  const onTouchEnd = () => {
    lastTouchDist.current = null;
    startRef.current = null;
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setUserPos({ lat: latitude, lng: longitude });
      // Smoothly center
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const worldSize = 1024;
      const x = lon2x(longitude) * worldSize;
      const y = lat2y(latitude) * worldSize;
      setTranslate({ x: cx - x * scale, y: cy - y * scale });
    });
  };

  const zoomIn = () => setScale((s) => clamp(s * 1.2, 0.5, 8));
  const zoomOut = () => setScale((s) => clamp(s / 1.2, 0.5, 8));

  const worldSize = 1024; // logical pixels

  const project = (lat: number, lng: number) => {
    const x = lon2x(lng) * worldSize * scale + translate.x;
    const y = lat2y(lat) * worldSize * scale + translate.y;
    return { x, y };
  };

  return (
    <div
      ref={containerRef}
      className={"relative touch-pan-y touch-pinch-zoom select-none bg-gray-100 " + (className || "")}
      style={{ ...style }}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Map content layer */}
      <div
        ref={contentRef}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(59,130,246,0.05) 0, transparent 40%), radial-gradient(circle at 75% 75%, rgba(16,185,129,0.06) 0, transparent 40%)",
          backgroundColor: "#f8fafc",
        }}
      />

      {/* Markers */}
      {allMarkers.map((m) => {
        const p = project(m.lat, m.lng);
        return (
          <button
            key={m.id}
            className="absolute -translate-x-1/2 -translate-y-full z-10"
            style={{ left: p.x, top: p.y }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMarker(m);
            }}
          >
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-blue-600" />
            </div>
          </button>
        );
      })}

      {/* User location marker */}
      {userPos && (
        (() => {
          const p = project(userPos.lat, userPos.lng);
          return (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: p.x, top: p.y }}
              title="موقعي"
            >
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow" />
            </div>
          );
        })()
      )}

      {/* Controls */}
      <div className="absolute top-3 right-3 space-y-2 z-30">
        <button
          onClick={zoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50"
          title="تكبير"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={zoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50"
          title="تصغير"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={locateMe}
          className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50"
          title="موقعي"
        >
          <Crosshair className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => setActiveMarker(null)}
          className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50"
          title="إعادة التمركز"
        >
          <Navigation className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Popup */}
      {activeMarker && (
        (() => {
          const p = project(activeMarker.lat, activeMarker.lng);
          return (
            <div
              className="absolute z-40 -translate-x-1/2 -translate-y-full"
              style={{ left: p.x, top: p.y - 12 }}
            >
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-64 overflow-hidden">
                <div className="relative h-24 bg-gray-100">
                  {activeMarker.image ? (
                    <img
                      src={activeMarker.image}
                      alt={activeMarker.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  ) : null}
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeMarker.subtitle || "عيادة"}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5 line-clamp-1">
                        {activeMarker.title}
                      </h3>
                      {typeof activeMarker.rating === "number" && (
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          {activeMarker.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    {activeMarker.phone && (
                      <a
                        href={`tel:${activeMarker.phone}`}
                        className="bg-green-600 text-white rounded-md p-1 hover:bg-green-700"
                        title="اتصال"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function touchDist(a: React.Touch, b: React.Touch) {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
}
