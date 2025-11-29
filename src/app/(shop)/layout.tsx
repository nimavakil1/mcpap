import Header from '@/components/shop/Header';
import Footer from '@/components/shop/Footer';
import { getSession } from '@/lib/auth';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <>
      <Header
        user={
          session
            ? {
                firstName: session.firstName,
                lastName: session.lastName,
                customerNumber: session.customerNumber,
              }
            : null
        }
        cartItemCount={0}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
