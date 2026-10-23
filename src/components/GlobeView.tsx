"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import type { Alumnus, Destination } from "@/types/alumni";
import { COLLEGES, DESTINATIONS, ORIGIN } from "@/lib/locations";
import { GlobeSkeleton } from "./GlobeSkeleton";

// Nota: questo modulo viene caricato solo lato client (AlumniExplorer lo importa
// con next/dynamic + ssr:false) e viene MONTATO solo quando la vista mappa è
// attiva, così la pagina a lista non paga il costo di WebGL/three.

const ACCENT = "#65dde0";
const ACCENT_DEEP = "#007ACC";
const ORIGIN_COLOR = "#ffd166";
const COLLEGE_COLOR = "#8ebeed";
const OCEAN = "#06243f";

type NodeKind = "origin" | "destination" | "college";

interface GlobePoint {
  id: string;
  kind: NodeKind;
  destination?: Destination;
  label: string;
  lat: number;
  lng: number;
  color: string;
  radius: number;
  altitude: number;
}

export function GlobeView({
  alumni,
  onSelectDestination,
}: {
  alumni: Alumnus[];
  onSelectDestination: (d: Destination) => void;
}) {
  const globeRef = useRef<any>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [grabbing, setGrabbing] = useState(false);
  // Poligoni terra + laghi uniti: ogni feature è taggata con __kind per gli accessor.
  const [polygons, setPolygons] = useState<object[]>([]);

  const counts = useMemo(() => {
    const c: Record<Destination, number> = { Chicago: 0, Taipei: 0 };
    for (const a of alumni) c[a.fellowship.destination]++;
    return c;
  }, [alumni]);

  // Materiale del globo: oceano navy scuro (nessuna texture raster → meno memoria).
  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: OCEAN,
        emissive: new THREE.Color("#041325"),
        emissiveIntensity: 0.35,
        shininess: 2,
      }),
    [],
  );

  // Terre emerse (paesi) + laghi, caricati da /public (stessa origine). I laghi
  // vengono disegnati sopra la terra con il colore dell'oceano per "ritagliarli".
  useEffect(() => {
    let active = true;
    const tag = (features: { properties?: object }[], kind: "land" | "lake") =>
      features.map((f) => Object.assign(f, { __kind: kind }));

    Promise.all([
      fetch("/countries-110m.geojson").then((r) => r.json()),
      fetch("/lakes-110m.geojson").then((r) => r.json()),
    ])
      .then(([land, lakes]) => {
        if (!active) return;
        setPolygons([...tag(land.features, "land"), ...tag(lakes.features, "lake")]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const isLake = (f: object) => (f as { __kind?: string }).__kind === "lake";

  const points = useMemo<GlobePoint[]>(() => {
    const dest: GlobePoint[] = (Object.keys(DESTINATIONS) as Destination[]).map((d) => ({
      id: DESTINATIONS[d].id,
      kind: "destination",
      destination: d,
      label: `${d} — ${counts[d]} alumni`,
      lat: DESTINATIONS[d].lat,
      lng: DESTINATIONS[d].lng,
      color: ACCENT,
      radius: 0.75,
      altitude: 0.012,
    }));

    const colleges: GlobePoint[] = COLLEGES.map((c) => ({
      id: c.id,
      kind: "college",
      label: `${c.label} · ${c.address} ${c.city} (${c.province})`,
      lat: c.lat,
      lng: c.lng,
      color: COLLEGE_COLOR,
      radius: 0.28,
      altitude: 0.006,
    }));

    const origin: GlobePoint = {
      id: ORIGIN.id,
      kind: "origin",
      label: ORIGIN.label,
      lat: ORIGIN.lat,
      lng: ORIGIN.lng,
      color: ORIGIN_COLOR,
      radius: 0.6,
      altitude: 0.012,
    };

    return [origin, ...dest, ...colleges];
  }, [counts]);

  // Archi: SOLO Perugia → Chicago e Perugia → Taipei.
  const arcs = useMemo(
    () =>
      (Object.keys(DESTINATIONS) as Destination[]).map((d) => ({
        id: `arc-${d}`,
        startLat: ORIGIN.lat,
        startLng: ORIGIN.lng,
        endLat: DESTINATIONS[d].lat,
        endLng: DESTINATIONS[d].lng,
        color: [`${ACCENT_DEEP}00`, ACCENT, ACCENT],
      })),
    [],
  );

  // Anelli pulsanti sotto i nodi (origine + destinazioni), con opacità sfumata.
  const rings = useMemo(
    () => [
      { lat: ORIGIN.lat, lng: ORIGIN.lng, rgb: "255,209,102", maxR: 2.2, period: 1600 },
      ...(Object.keys(DESTINATIONS) as Destination[]).map((d) => ({
        lat: DESTINATIONS[d].lat,
        lng: DESTINATIONS[d].lng,
        rgb: "101,221,224",
        maxR: 3.4,
        period: 1300,
      })),
    ],
    [],
  );

  // Dimensionamento reattivo del canvas.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rilascio della memoria GPU allo smontaggio. NB: niente forceContextLoss() —
  // con StrictMode (doppio mount in dev) corromperebbe il contesto appena creato
  // (errore "operation failed, code 1"). react-kapsule gestisce il teardown; qui
  // ci limitiamo a svuotare la cache delle geometrie/texture di three.
  useEffect(() => {
    return () => {
      try {
        globeRef.current?.renderer?.()?.renderLists?.dispose?.();
      } catch {
        /* no-op */
      }
    };
  }, []);

  // Impostazioni iniziali: camera centrata su PERUGIA, nessuna rotazione automatica,
  // pixel ratio limitato per contenere il consumo di memoria.
  const handleReady = useCallback(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView({ lat: ORIGIN.lat, lng: ORIGIN.lng, altitude: 2.2 }, 0);

    const controls = g.controls();
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.minDistance = 180;
    controls.maxDistance = 600;
    controls.enablePan = false;

    try {
      // pixelRatio bloccato a 1: riduce drasticamente i pixel da disegnare su
      // schermi retina (meno blocchi/freeze), con qualità comunque buona.
      g.renderer().setPixelRatio(1);
    } catch {
      /* no-op */
    }
    setReady(true);
  }, []);

  // Rilascio del "grab" anche se il mouse viene rilasciato fuori dalla scena.
  useEffect(() => {
    const up = () => setGrabbing(false);
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  // Mette in pausa il ciclo di rendering quando la tab non è visibile.
  useEffect(() => {
    const onVisibility = () => {
      const g = globeRef.current;
      if (!g) return;
      if (document.hidden) g.pauseAnimation?.();
      else g.resumeAnimation?.();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const focusOn = useCallback((lat: number, lng: number) => {
    globeRef.current?.pointOfView({ lat, lng, altitude: 1.5 }, 900);
  }, []);

  const handlePointClick = useCallback(
    (pt: object) => {
      const p = pt as GlobePoint;
      if (p.kind === "destination" && p.destination) {
        focusOn(p.lat, p.lng);
        onSelectDestination(p.destination);
      } else if (p.kind === "origin") {
        focusOn(p.lat, p.lng);
      }
    },
    [focusOn, onSelectDestination],
  );

  // Etichette HTML sempre visibili per origine + destinazioni (cliccabili).
  const buildLabel = useCallback(
    (d: object) => {
      const p = d as GlobePoint;
      const el = document.createElement("div");
      el.style.pointerEvents = p.kind === "destination" ? "auto" : "none";
      el.style.cursor = p.kind === "destination" ? "pointer" : "default";

      if (p.kind === "origin") {
        el.innerHTML = `<div class="globe-chip globe-chip--origin">Perugia<span>Sede Centrale</span></div>`;
      } else if (p.kind === "destination") {
        const n = p.destination ? counts[p.destination] : 0;
        el.innerHTML = `<div class="globe-chip globe-chip--dest"><span class="globe-chip__dot"></span>${p.destination}<b>${n}</b></div>`;
        el.onclick = () => {
          if (p.destination) {
            focusOn(p.lat, p.lng);
            onSelectDestination(p.destination);
          }
        };
      }
      return el;
    },
    [counts, focusOn, onSelectDestination],
  );

  const labelData = useMemo(() => points.filter((p) => p.kind !== "college"), [points]);

  return (
    <div
      ref={wrapRef}
      data-grabbing={grabbing}
      onPointerDown={() => setGrabbing(true)}
      className="globe-stage relative h-full w-full"
    >
      {size.w > 0 && size.h > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          rendererConfig={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={ACCENT}
          atmosphereAltitude={0.14}
          onGlobeReady={handleReady}
          polygonsData={polygons}
          polygonAltitude={(f: object) => (isLake(f) ? 0.007 : 0.006)}
          polygonCapColor={(f: object) => (isLake(f) ? OCEAN : "#0e4a74")}
          polygonSideColor={(f: object) => (isLake(f) ? "rgba(0,0,0,0)" : "rgba(6,36,63,0.6)")}
          polygonStrokeColor={(f: object) =>
            isLake(f) ? "rgba(101,221,224,0.28)" : "rgba(101,221,224,0.55)"
          }
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude="altitude"
          pointRadius="radius"
          pointLabel="label"
          pointsMerge={false}
          onPointClick={handlePointClick}
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcAltitudeAutoScale={0.5}
          arcStroke={0.65}
          arcDashLength={0.45}
          arcDashGap={0.25}
          arcDashInitialGap={() => Math.random()}
          arcDashAnimateTime={2200}
          ringsData={rings}
          ringLat="lat"
          ringLng="lng"
          ringColor={(r: object) => {
            const rgb = (r as { rgb: string }).rgb;
            return (t: number) => `rgba(${rgb},${Math.sqrt(1 - t)})`;
          }}
          ringMaxRadius="maxR"
          ringPropagationSpeed={2}
          ringRepeatPeriod="period"
          htmlElementsData={labelData}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.02}
          htmlElement={buildLabel}
        />
      )}

      {!ready && <GlobeSkeleton />}
    </div>
  );
}
