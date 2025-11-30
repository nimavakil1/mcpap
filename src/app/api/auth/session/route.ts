import { NextResponse } from 'next/server';
import { getSession, getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    // Check if this is an admin session
    if (session.isAdmin) {
      const admin = await prisma.adminUser.findUnique({
        where: { id: session.id },
      });

      if (!admin) {
        return NextResponse.json({ user: null });
      }

      return NextResponse.json({
        user: {
          id: admin.id,
          email: admin.email,
          firstName: admin.name.split(' ')[0] || admin.name,
          lastName: admin.name.split(' ').slice(1).join(' ') || '',
          isAdmin: true,
          adminRole: admin.role,
        },
      });
    }

    // Regular user session
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
