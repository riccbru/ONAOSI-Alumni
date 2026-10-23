import { Html, Head, Main, NextScript } from "next/document";

/**
 * Documento HTML di base (Pages Router). Qui vivono i tag <html>/<body>:
 * lingua, classi globali del body e il tema colore.
 */
export default function Document() {
  return (
    <Html lang="it">
      <Head>
        <meta name="theme-color" content="#003366" />
      </Head>
      <body className="bg-neutral-50 text-text antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
