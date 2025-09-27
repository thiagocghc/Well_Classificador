import Navbar from "@/components/Navbar";
import SobrePage from "@/components/SobrePage";

export default function Page() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* @ts-expect-error client component */}
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:py-8">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Sobre o Projeto</h1>
          <p className="mt-1 text-sm text-gray-600">Descrição e próximos passos</p>
        </header>
        {/* @ts-expect-error client component */}
        <SobrePage />
      </div>
    </main>
  );
}
