import Head from "next/head";
import Link from "next/link";
import { GlobeIcon } from "@/components/icons";

/**
 * Pagina 404 personalizzata (Pages Router): coerente col tema ONAOSI,
 * con un rimando alla home.
 */
export default function NotFound() {
  return (
    <>
      <Head>
        <title>Pagina non trovata · ONAOSI Alumni</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800 px-6 text-center text-text-inverse">
        <span className="grid h-20 w-20 place-items-center rounded-2xl bg-white/10 text-accent ring-1 ring-accent/40">
          <GlobeIcon className="h-10 w-10" />
        </span>

        <p className="mt-8 text-6xl font-black tracking-tight text-accent sm:text-7xl">404</p>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">Pagina non trovata</h1>
        <p className="mt-3 max-w-md text-sm text-white/70">
          La pagina che cerchi non esiste o è stata spostata. Torna alla rete
          degli alumni ONAOSI.
        </p>

        <Link
          href="/"
          className="press mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary-950 shadow-sm transition-colors duration-150 ease-out hover:bg-accent-soft"
        >
          Torna alla home
        </Link>
      </main>
    </>
  );
}
