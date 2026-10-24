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
        {/* Icone (stemma ONAOSI) per tab browser e home screen. */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/brand/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/brand/apple-icon-180x180.png" />
      </Head>
      <body className="bg-neutral-50 text-text antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
