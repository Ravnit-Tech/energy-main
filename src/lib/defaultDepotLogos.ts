function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function makeDepotLogo(
  initials: string,
  color1: string,
  color2: string,
  accent: string,
  ringColor: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="bg" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </radialGradient>
    <filter id="sh">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
    </filter>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#bg)" stroke="${accent}" stroke-width="2.5"/>
  <circle cx="50" cy="50" r="43" fill="none" stroke="${ringColor}" stroke-width="1.2"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="${ringColor}" stroke-width="0.6" opacity="0.5"/>
  <path d="M50 17 C49 20 40 30 38 40 Q37 53 50 58 Q63 53 62 40 C60 30 51 20 50 17Z" fill="rgba(255,255,255,0.92)" filter="url(#sh)"/>
  <ellipse cx="50" cy="47" rx="7" ry="5" fill="${color2}" opacity="0.35"/>
  <text x="50" y="80" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="13" font-weight="900" fill="white" letter-spacing="1.5" filter="url(#sh)">${initials}</text>
</svg>`;
  return svgToDataUri(svg);
}

export const DEFAULT_DEPOT_LOGOS: Record<string, string> = {
  "Lagos Main Depot":          makeDepotLogo("LMD", "#f97316", "#9a3412", "#fb923c", "rgba(255,255,255,0.2)"),
  "Port Harcourt Terminal":    makeDepotLogo("PHT", "#3b82f6", "#1e3a8a", "#60a5fa", "rgba(255,255,255,0.2)"),
  "Warri Storage Facility":    makeDepotLogo("WSF", "#10b981", "#064e3b", "#34d399", "rgba(255,255,255,0.2)"),
  "Kaduna Distribution Center":makeDepotLogo("KDC", "#8b5cf6", "#4c1d95", "#a78bfa", "rgba(255,255,255,0.2)"),
  "Calabar Depot":             makeDepotLogo("CD",  "#06b6d4", "#0c4a6e", "#22d3ee", "rgba(255,255,255,0.2)"),
  "Ibadan Storage Terminal":   makeDepotLogo("IST", "#f59e0b", "#78350f", "#fbbf24", "rgba(255,255,255,0.2)"),
  "Kano Distribution Hub":     makeDepotLogo("KDH", "#ef4444", "#7f1d1d", "#f87171", "rgba(255,255,255,0.2)"),
  "Enugu Fuel Depot":          makeDepotLogo("EFD", "#84cc16", "#365314", "#a3e635", "rgba(255,255,255,0.2)"),
  "Abuja Central Terminal":    makeDepotLogo("ACT", "#0ea5e9", "#0c4a6e", "#38bdf8", "rgba(255,255,255,0.2)"),
  "Benin Storage Depot":       makeDepotLogo("BSD", "#7c3aed", "#3b0764", "#a855f7", "rgba(255,255,255,0.2)"),
};
