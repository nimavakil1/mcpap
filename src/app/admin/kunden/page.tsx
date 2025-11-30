import Link from 'next/link';
import { Search, Eye, Users } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata = {
  title: 'Kunden - Admin | McPaper',
};

interface CustomersPageProps {
  searchParams: Promise<{ page?: string; search?: string; group?: string }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const groupId = params.group || '';
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (groupId) {
    where.customerGroupId = groupId;
  }

  const [customers, total, customerGroups] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        customerGroup: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
    prisma.customerGroup.findMany({
      orderBy: { discountPercentage: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kunden</h1>
        <p className="text-gray-600">{total} Kunden insgesamt</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Suche nach Name, E-Mail oder Firma..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E31E24]"
              />
            </div>
          </div>
          <select
            name="group"
            defaultValue={groupId}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E31E24]"
          >
            <option value="">Alle Kundengruppen</option>
            {customerGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.discountPercentage}%)
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Filtern
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold">Kunde</th>
              <th className="text-left p-4 font-semibold">E-Mail</th>
              <th className="text-left p-4 font-semibold">Firma</th>
              <th className="text-center p-4 font-semibold">Kundengruppe</th>
              <th className="text-center p-4 font-semibold">Bestellungen</th>
              <th className="text-left p-4 font-semibold">Registriert</th>
              <th className="text-right p-4 font-semibold">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <Users size={40} className="mx-auto mb-2 opacity-50" />
                  Keine Kunden gefunden
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E31E24] rounded-full flex items-center justify-center text-white font-medium">
                        {customer.firstName?.[0]}
                        {customer.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">
                          {customer.firstName} {customer.lastName}
                        </p>
                        {customer.isVerifiedBusiness && (
                          <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                            Verifiziert
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{customer.email}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {customer.companyName || '-'}
                  </td>
                  <td className="p-4 text-center">
                    {customer.customerGroup && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          customer.customerGroup.discountPercentage >= 15
                            ? 'bg-purple-100 text-purple-700'
                            : customer.customerGroup.discountPercentage >= 10
                            ? 'bg-yellow-100 text-yellow-700'
                            : customer.customerGroup.discountPercentage >= 5
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {customer.customerGroup.name}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center text-sm">
                    {customer._count.orders}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(customer.createdAt).toLocaleDateString('de-DE')}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/kunden/${customer.id}`}
                      className="p-2 text-gray-500 hover:text-[#E31E24] transition-colors inline-block"
                      title="Details"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Seite {page} von {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/kunden?page=${page - 1}${search ? `&search=${search}` : ''}${groupId ? `&group=${groupId}` : ''}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Zurück
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/kunden?page=${page + 1}${search ? `&search=${search}` : ''}${groupId ? `&group=${groupId}` : ''}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Weiter
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
