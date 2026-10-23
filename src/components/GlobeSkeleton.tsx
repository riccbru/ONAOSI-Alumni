/**
 * Skeleton della vista mappa: un mappamondo wireframe (linee di latitudine e
 * longitudine) che ruota lentamente mentre il chunk WebGL viene scaricato e il
 * globo si inizializza. Porta con sé lo stesso sfondo scuro dello stage del
 * globo, così è coerente in entrambi gli usi (loading del dynamic + overlay
 * interno a GlobeView). Rispetta prefers-reduced-motion.
 */
export function GlobeSkeleton() {
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{
        background:
          "radial-gradient(130% 90% at 50% 18%, #0a2f52 0%, #041d35 45%, #020f1f 100%)",
      }}
      role="status"
      aria-label="Caricamento mappa"
    >
      <div className="flex flex-col items-center gap-4 text-text-inverse/80">
        <svg
          viewBox="0 0 120 120"
          className="h-24 w-24 animate-[spin_8s_linear_infinite] text-accent motion-reduce:animate-none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          {/* sfera */}
          <circle cx="60" cy="60" r="52" opacity="0.9" />
          {/* meridiani (longitudine) */}
          <ellipse cx="60" cy="60" rx="22" ry="52" opacity="0.55" />
          <ellipse cx="60" cy="60" rx="40" ry="52" opacity="0.3" />
          <line x1="60" y1="8" x2="60" y2="112" opacity="0.55" />
          {/* paralleli (latitudine) */}
          <ellipse cx="60" cy="60" rx="52" ry="22" opacity="0.55" />
          <ellipse cx="60" cy="60" rx="52" ry="40" opacity="0.3" />
          <line x1="8" y1="60" x2="112" y2="60" opacity="0.55" />
        </svg>
        <span className="text-sm font-medium">Caricamento mappa…</span>
      </div>
    </div>
  );
}
