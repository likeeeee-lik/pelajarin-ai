import { PricingPlans } from "@/components/marketing/pricing-plans";

export default function UpgradePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold">Pilih Plan yang Tepat</h1>
        <p className="mt-2 text-muted">
          Tingkatkan pembelajaran dengan AI. Pilih plan sesuai kebutuhan belajar Anda.
        </p>
      </header>
      <PricingPlans />
    </div>
  );
}
