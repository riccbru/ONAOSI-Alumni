import type { AppProps } from "next/app";
import Head from "next/head";
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
          content="La rete degli alumni ONAOSI: mappa 3D interattiva delle fellowship (Perugia → Chicago, Taipei) e direttorio completo dei borsisti."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
