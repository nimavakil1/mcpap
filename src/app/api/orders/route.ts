import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MP-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const body = await request.json();
    const { billingAddress, shippingAddress, paymentMethod, orderNote } = body;

    // Get user with cart
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        customerGroup: true,
      },
    });

    if (!user || !user.cart || user.cart.items.length === 0) {
      return NextResponse.json({ error: 'Warenkorb ist leer' }, { status: 400 });
    }

    // Calculate totals
    const discountPercentage = user.customerGroup?.discountPercentage || 0;
    let subtotal = 0;

    for (const item of user.cart.items) {
      subtotal += Number(item.product.basePrice) * item.quantity;
    }

    const discountAmount = subtotal * (discountPercentage / 100);
    const afterDiscount = subtotal - discountAmount;
    const shippingCost = afterDiscount >= 50 ? 0 : 4.95;

    // Calculate tax (assume 19% included)
    const taxRate = 19;
    const taxAmount = afterDiscount - (afterDiscount / (1 + taxRate / 100));
    const total = afterDiscount + shippingCost;

    // Create order
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PENDING',
        paymentStatus: paymentMethod === 'invoice' ? 'PENDING' : 'PENDING',
        paymentMethod,
        subtotal,
        discountAmount,
        shippingCost,
        taxAmount,
        total,
        billingAddress: {
          company: billingAddress.company || '',
          firstName: billingAddress.firstName,
          lastName: billingAddress.lastName,
          street: billingAddress.street,
          houseNumber: billingAddress.houseNumber,
          postalCode: billingAddress.postalCode,
          city: billingAddress.city,
          country: billingAddress.country,
          phone: billingAddress.phone || '',
        },
        shippingAddress: {
          company: shippingAddress.company || '',
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          street: shippingAddress.street,
          houseNumber: shippingAddress.houseNumber,
          postalCode: shippingAddress.postalCode,
          city: shippingAddress.city,
          country: shippingAddress.country,
          phone: shippingAddress.phone || '',
        },
        notes: orderNote || null,
        items: {
          create: user.cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku,
            quantity: item.quantity,
            unitPrice: item.product.basePrice,
            discountPercentage,
            totalPrice: Number(item.product.basePrice) * item.quantity * (1 - discountPercentage / 100),
          })),
        },
      },
    });

    // Update product stock
    for (const item of user.cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Generate store voucher if applicable
    if (total >= 100) {
      const voucherAmount = total >= 150 ? 10 : 5;
      const voucherCode = `FIL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + 6);

      await prisma.storeVoucher.create({
        data: {
          code: voucherCode,
          amount: voucherAmount,
          userId: user.id,
          orderId: order.id,
          validUntil,
        },
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: user.cart.id },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Bestellung' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.id },
        include: {
          items: true,
          voucher: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: { userId: session.id },
      }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Bestellungen' },
      { status: 500 }
    );
  }
}
