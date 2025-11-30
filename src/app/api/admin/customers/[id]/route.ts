import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const customer = await prisma.user.findUnique({
      where: { id },
      include: {
        customerGroup: true,
        _count: {
          select: { orders: true, favorites: true },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const customer = await prisma.user.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || null,
        companyName: body.companyName || null,
        billingStreet: body.billingStreet || null,
        billingCity: body.billingCity || null,
        billingPostalCode: body.billingPostalCode || null,
        billingCountry: body.billingCountry || 'Deutschland',
        shippingStreet: body.shippingStreet || null,
        shippingCity: body.shippingCity || null,
        shippingPostalCode: body.shippingPostalCode || null,
        shippingCountry: body.shippingCountry || 'Deutschland',
        customerGroupId: body.customerGroupId || null,
        isActive: body.isActive,
        isVerifiedBusiness: body.isVerifiedBusiness,
        canPurchaseOnInvoice: body.canPurchaseOnInvoice,
      },
      include: {
        customerGroup: true,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
