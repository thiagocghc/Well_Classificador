import Navbar from "@/components/Navbar";
import ClassificarPage from "@/components/ClassificarPage";

export default function Page() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* @ts-expect-error client component */}
      <Navbar />
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:py-8">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Classificar Questão</h1>
          <p className="mt-1 text-sm text-gray-600">Cole o enunciado e obtenha a classe</p>
        </header>
        {/* @ts-expect-error client component */}
        <ClassificarPage />
      </div>
    </main>
  );
}