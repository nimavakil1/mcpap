import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

function generateVoucherCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'MCP-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vouchers = await prisma.storeVoucher.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, amount, expiresInDays } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Kunde ist erforderlich' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Kunde nicht gefunden' }, { status: 404 });
    }

    // Get or create a placeholder order for manual vouchers
    // First, check if user has any order we can link to
    let order = await prisma.order.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!order) {
      // Create a placeholder order for the manual voucher
      const orderNumber = `MCP-MANUAL-${Date.now()}`;
      order = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          status: 'delivered',
          subtotal: 0,
          taxAmount: 0,
          shippingCost: 0,
          total: 0,
          shippingAddress: {},
          billingAddress: {},
          paymentMethod: 'manual',
          paymentStatus: 'paid',
          notes: 'Manuell erstellter Gutschein',
        },
      });
    }

    // Generate unique code
    let code: string;
    let isUnique = false;
    do {
      code = generateVoucherCode();
      const existing = await prisma.storeVoucher.findUnique({ where: { code } });
      isUnique = !existing;
    } while (!isUnique);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 365));

    const voucher = await prisma.storeVoucher.create({
      data: {
        userId,
        orderId: order.id,
        code,
        amount: amount || 5,
        expiresAt,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.error('Error creating voucher:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
