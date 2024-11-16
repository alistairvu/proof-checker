import { ProofPage } from "~/components/proof-page";

export default async function Home() {
  return (
    <div className="container py-4">
      <header>
        <h1 className="text-2xl font-semibold">natural deduction</h1>
      </header>

      <main className="py-4">
        <ProofPage />
      </main>
    </div>
  );
}
