# ONAOSI Alumni Network

Interfaccia della rete alumni ONAOSI: una **mappa 3D interattiva** delle fellowship
(archi luminosi da Perugia → Chicago e Perugia → Taipei) e un **direttorio completo**
ad accordion. Design System ONAOSI (Titillium Web, scala di blu, accento ciano `#65dde0`).

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS 3** con i token ONAOSI (`tailwind.config.ts`, `styles/onaosi-theme.css`)
- **react-globe.gl** / **three** per il globo 3D
- **framer-motion** per micro-interazioni ed easing (linee guida Emil Kowalski)

## Avvio

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build di produzione
```

## Dati

Gli alumni vivono in `data/alumni/<anno>/<slug>.json` e vengono letti a build-time
in Server Component (`src/lib/alumni.ts`). Il loader è **tollerante**: ignora virgole
finali e caratteri di controllo grezzi, così le modifiche manuali ai JSON non rompono
la build. Campi chiave per vista: `fellowship.destination` (Chicago | Taipei),
`fellowship.cohort` (2025 | 2026), `fellowship.isTeamLeader`, `fellowship.projectAbstract`
(preferito a `summary` quando presente).

## Struttura

```
src/
  app/            layout, page (Server Component che carica i dati), globals.css
  components/     Header, ViewToggle, GlobeView, CityDrawer, ListView,
                  AccordionItem, AlumniAccordionList, SearchBar, FilterPills, …
  lib/            alumni (loader), locations (coordinate), filters (ricerca/filtri)
  types/          modello Alumnus
```
