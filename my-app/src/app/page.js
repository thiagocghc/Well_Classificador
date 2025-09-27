import Navbar from "@/components/Navbar";
import HomePage from "@/components/HomePage";

export default function Page() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Navbar é client component */}
      {/* @ts-expect-error Async Server Component boundary com client child */}
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:py-8">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Sistema de Classificação de Questões</h1>
          <p className="mt-1 text-sm text-gray-600">Explorar • Filtrar • Visualizar</p>
        </header>
        {/* @ts-expect-error client component */}
        <HomePage />
      </div>
    </main>
  );
}