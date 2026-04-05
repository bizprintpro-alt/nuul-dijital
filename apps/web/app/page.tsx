import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-brand-600">Nuul.mn</div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/domains" className="text-gray-600 hover:text-gray-900">
              Домэйн
            </Link>
            <Link
              href="/hosting"
              className="text-gray-600 hover:text-gray-900"
            >
              Хостинг
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900"
            >
              Үнэ
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
            >
              Нэвтрэх
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Таны бизнесийн
          <span className="text-brand-600"> дижитал шийдэл</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Домэйн нэр бүртгэл, хостинг үйлчилгээ, вэбсайт бүтээх - бүгдийг
          нэг платформоос. Монголын хамгийн хурдан, найдвартай дижитал
          үйлчилгээ.
        </p>

        {/* Domain Search */}
        <div className="mx-auto mt-10 max-w-2xl">
          <form className="flex gap-2">
            <input
              type="text"
              placeholder="Домэйн нэрээ хайх... (жишээ: minii-biznes.mn)"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-8 py-3 text-lg font-medium text-white hover:bg-brand-700"
            >
              Хайх
            </button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Яагаад Nuul.mn?
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                title: ".mn домэйн",
                desc: "Монгол домэйн нэрийг хамгийн хялбараар бүртгүүлээрэй. .mn, .com.mn, .org.mn",
                icon: "🌐",
              },
              {
                title: "Хурдан хостинг",
                desc: "SSD дээр суурилсан хурдан серверүүд. 99.9% uptime баталгаа.",
                icon: "⚡",
              },
              {
                title: "QPay төлбөр",
                desc: "QPay, SocialPay-ээр шууд төлбөрөө хийгээрэй. Хялбар, аюулгүй.",
                icon: "💳",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Хостинг үнэ
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "9,900",
                features: [
                  "1GB SSD",
                  "1 вэбсайт",
                  "SSL үнэгүй",
                  "Имэйл 1",
                ],
              },
              {
                name: "Business",
                price: "29,900",
                features: [
                  "10GB SSD",
                  "5 вэбсайт",
                  "SSL үнэгүй",
                  "Имэйл 10",
                  "Өдөр бүрийн backup",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "99,900",
                features: [
                  "50GB SSD",
                  "Хязгааргүй вэбсайт",
                  "SSL үнэгүй",
                  "Хязгааргүй имэйл",
                  "Өдөр бүрийн backup",
                  "Тусгай дэмжлэг",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border-2 p-8 ${
                  plan.popular
                    ? "border-brand-600 shadow-lg"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <span className="mb-4 inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
                    Хамгийн их сонгодог
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₮{plan.price}
                  </span>
                  <span className="text-gray-500">/сар</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-lg py-3 font-medium ${
                    plan.popular
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Сонгох
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-gray-500">
          <p>&copy; 2024 Nuul.mn - Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </footer>
    </div>
  );
}
