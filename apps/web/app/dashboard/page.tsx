export default function DashboardPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Хяналтын самбар
      </h2>

      {/* Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        {[
          { label: "Нийт домэйн", value: "3", change: "+1 энэ сард" },
          { label: "Идэвхтэй хостинг", value: "2", change: "Business план" },
          { label: "Нийт захиалга", value: "7", change: "2 хүлээгдэж буй" },
          {
            label: "Нийт төлбөр",
            value: "₮259,700",
            change: "Энэ жил",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Сүүлийн захиалгууд
        </h3>
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="pb-3">Захиалга</th>
              <th className="pb-3">Төрөл</th>
              <th className="pb-3">Дүн</th>
              <th className="pb-3">Төлөв</th>
              <th className="pb-3">Огноо</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              {
                id: "#1001",
                type: "Домэйн",
                amount: "₮25,000",
                status: "Төлсөн",
                date: "2024-01-15",
              },
              {
                id: "#1002",
                type: "Хостинг",
                amount: "₮29,900",
                status: "Төлсөн",
                date: "2024-01-15",
              },
              {
                id: "#1003",
                type: "Домэйн",
                amount: "₮35,000",
                status: "Хүлээгдэж буй",
                date: "2024-01-20",
              },
            ].map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3 font-medium">{order.id}</td>
                <td className="py-3">{order.type}</td>
                <td className="py-3">{order.amount}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      order.status === "Төлсөн"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
