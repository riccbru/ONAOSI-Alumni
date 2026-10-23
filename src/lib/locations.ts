import type { Destination } from "@/types/alumni";

export interface GeoPoint {
  id: string;
  label: string;
  lat: string | number;
  lng: string | number;
}

type Coord = { lat: number; lng: number };

/**
 * Punto d'origine fisso: Perugia — Sede Centrale ONAOSI.
 * Tutti gli archi luminosi partono da qui.
 */
export const ORIGIN = {
  id: "perugia-origin",
  label: "Perugia — Sede Centrale ONAOSI",
  lat: 43.1107,
  lng: 12.3908,
} as const satisfies GeoPoint;

/**
 * Città di destinazione delle fellowship (collegate a Perugia da un arco).
 */
export const DESTINATIONS: Record<Destination, GeoPoint & Coord> = {
  Chicago: {
    id: "chicago",
    label: "Chicago (USA)",
    lat: 41.7886,
    lng: -87.5987,
  },
  Taipei: {
    id: "taipei",
    label: "Taipei (Taiwan)",
    lat: 25.017,
    lng: 121.5397,
  },
};

export interface College extends GeoPoint {
  lat: number;
  lng: number;
  address: string;
  city: string;
  province: string;
  note?: string;
}

/**
 * I collegi ONAOSI — rappresentati come nodi sul mappamondo, senza archi.
 * Coordinate approssimate per i rispettivi indirizzi.
 */
export const COLLEGES: College[] = [
  {
    id: "bologna",
    label: "Collegio di Bologna",
    address: "Via Irma Bandiera 1, 40134",
    city: "Bologna",
    province: "BO",
    lat: 44.4889,
    lng: 11.3215,
  },
  {
    id: "messina",
    label: "Collegio di Messina",
    address: "Via del Fante 90, SS. Annunziata, 98100",
    city: "Messina",
    province: "ME",
    lat: 38.2013,
    lng: 15.5503,
  },
  {
    id: "milano",
    label: "Collegio di Milano",
    address: "Via Don Giovanni Minzoni 27, 20158",
    city: "Milano",
    province: "MI",
    lat: 45.4934,
    lng: 9.1817,
  },
  {
    id: "napoli-consalvo",
    label: "Collegio di Napoli — Fuorigrotta",
    address: "Via Consalvo 8, Fuorigrotta, 80125",
    city: "Napoli",
    province: "NA",
    lat: 40.8231,
    lng: 14.1912,
  },
  {
    id: "napoli-ferraris",
    label: "Collegio di Napoli — Ferraris",
    address: "Via Galileo Ferraris 4, 80142",
    city: "Napoli",
    province: "NA",
    lat: 40.8458,
    lng: 14.2712,
  },
  {
    id: "padova-femminile",
    label: "Collegio di Padova — Femminile",
    address: "Via Nazareth 3, 35128",
    city: "Padova",
    province: "PD",
    note: "Collegio Femminile",
    lat: 45.3949,
    lng: 11.9035,
  },
  {
    id: "padova-maschile",
    label: "Collegio di Padova — Maschile",
    address: "Via Bergamo 21, 35142",
    city: "Padova",
    province: "PD",
    note: "Collegio Maschile",
    lat: 45.4051,
    lng: 11.9123,
  },
  {
    id: "palermo",
    label: "Collegio di Palermo",
    address: "Via dei Benedettini 5, Camplus Palermo Normanni, 90134",
    city: "Palermo",
    province: "PA",
    lat: 38.1095,
    lng: 13.3517,
  },
  {
    id: "pavia",
    label: "Collegio di Pavia",
    address: "Via Amati 12, 27100",
    city: "Pavia",
    province: "PV",
    lat: 45.1951,
    lng: 9.1648,
  },
  {
    id: "perugia-cupa",
    label: "Collegio di Perugia — Via della Cupa",
    address: "Via della Cupa 52, 06123",
    city: "Perugia",
    province: "PG",
    lat: 43.1122,
    lng: 12.3782,
  },
  {
    id: "perugia-montecorneo",
    label: "Collegio Unico di Perugia",
    address: "Strada Montecorneo 45, 06126",
    city: "Perugia",
    province: "PG",
    note: "Collegio Unico",
    lat: 43.0881,
    lng: 12.4301,
  },
  {
    id: "roma",
    label: "Collegio della Sapienza — Roma",
    address: "Via Don Orione 17, 00183",
    city: "Roma",
    province: "RM",
    note: "sede originale",
    lat: 41.8852,
    lng: 12.5143,
  },
  {
    id: "torino-basilica",
    label: "Torino — Sede Centrale",
    address: "Via della Basilica 4, 10122",
    city: "Torino",
    province: "TO",
    note: "Sede Centrale",
    lat: 45.0731,
    lng: 7.6869,
  },
  {
    id: "torino-citta",
    label: "Torino — Sede Distaccata",
    address: "Via Palazzo di Città 10, 10122",
    city: "Torino",
    province: "TO",
    note: "Sede Distaccata",
    lat: 45.0701,
    lng: 7.6834,
  },
];
