import { Package, ShoppingCart, Users, Euro, TrendingUp, AlertCircle } from 'lucide-react';
import prisma from '@/lib/db';

export default async function AdminDashboard() {
  // Get statistics
  const [productCount, orderCount, customerCount, lowStockProducts, recentOrders] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { stockQuantity: { lte: 5 }, isActive: true },
      take: 5,
      orderBy: { stockQuantity: 'asc' },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }),
  ]);

  const stats = [
    { name: 'Produkte', value: productCount, icon: Package, color: 'bg-blue-500' },
    { name: 'Bestellungen', value: orderCount, icon: ShoppingCart, color: 'bg-green-500' },
    { name: 'Kunden', value: customerCount, icon: Users, color: 'bg-purple-500' },
    { name: 'Niedriger Bestand', value: lowStockProducts.length, icon: AlertCircle, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-[#666]">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">Letzte Bestellungen</h2>
          </div>
          <div className="card-body">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center pb-4 border-b border-[#E0E0E0] last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-[#666]">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{Number(order.total).toFixed(2)} €</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#666]">Keine Bestellungen vorhanden</p>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">Niedriger Bestand</h2>
          </div>
          <div className="card-body">
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center pb-4 border-b border-[#E0E0E0] last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-[#666]">{product.sku}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      product.stockQuantity === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {product.stockQuantity} Stück
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#666]">Alle Produkte haben ausreichend Bestand</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
