import Link from "next/link";

const sidebarLinks = [
  { href: "/dashboard", label: "Хяналтын самбар", icon: "📊" },
  { href: "/dashboard/domains", label: "Домэйнууд", icon: "🌐" },
  { href: "/dashboard/hosting", label: "Хостинг", icon: "🖥️" },
  { href: "/dashboard/orders", label: "Захиалгууд", icon: "📋" },
  { href: "/dashboard/payments", label: "Төлбөр", icon: "💳" },
  { href: "/dashboard/settings", label: "Тохиргоо", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold text-brand-600">
            Nuul.mn
          </Link>
        </div>
        <nav className="space-y-1 px-3">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              <span>{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <header className="border-b bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">admin@nuul.mn</span>
              <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200">
                Гарах
              </button>
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
