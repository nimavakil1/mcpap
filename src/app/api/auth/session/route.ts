import { NextResponse } from 'next/server';
import { getSession, getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        customerNumber: user.customerNumber,
        customerGroup: user.customerGroup,
        isVerifiedBusiness: user.isVerifiedBusiness,
        canPurchaseOnInvoice: user.canPurchaseOnInvoice,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}
