import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";
import { PricingPlans } from "@/components/marketing/pricing-plans";

export default function HargaPage() {
  return (
    <div className="bg-ink-900">
      <MarketingNavbar />
      <section className="bg-aurora">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <header className="mb-4 text-center">
            <h1 className="text-4xl font-extrabold">Pilih Plan yang Tepat</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted">
              Tingkatkan pembelajaran dengan AI. Pilih plan sesuai kebutuhan belajar Anda.
            </p>
          </header>
          <PricingPlans />
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
