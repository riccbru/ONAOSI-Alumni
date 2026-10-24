import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/styles/globals.css";

/**
 * App root (Pages Router): importa il CSS globale e definisce i metadati di
 * default condivisi da tutte le pagine (titolo, descrizione, viewport).
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ONAOSI Alumni Network</title>
        <meta
          name="description"
          content="Network degli alumni ONAOSI: directory di fellowship ed esperienze internazionali per connettere talenti nel mondo"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
