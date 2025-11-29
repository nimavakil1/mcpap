import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET - Get user's cart
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const cart = await prisma.cart.findFirst({
      where: {
        userId: session.id,
        isActive: true,
        name: null, // Active cart (not saved)
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    // Calculate totals with discount
    const discountPercentage = session.discountPercentage || 0;
    let subtotal = 0;
    let taxAmount = 0;

    const items = cart.items.map((item) => {
      const basePrice = Number(item.product.basePrice);
      const discountedPrice = basePrice * (1 - discountPercentage / 100);
      const itemTotal = discountedPrice * item.quantity;
      const itemTax = itemTotal * (Number(item.product.taxRate) / 100);

      subtotal += itemTotal;
      taxAmount += itemTax;

      return {
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          sku: item.product.sku,
          basePrice,
          discountedPrice,
          taxRate: Number(item.product.taxRate),
          unitOfMeasure: item.product.unitOfMeasure,
          stockQuantity: item.product.stockQuantity,
          minimumOrderQuantity: item.product.minimumOrderQuantity,
          isAvailableOnline: item.product.isAvailableOnline,
          image: item.product.images[0]?.url,
        },
        itemTotal,
      };
    });

    const shippingCost = subtotal >= 50 ? 0 : 5.95;
    const total = subtotal + shippingCost;

    // Calculate voucher amount
    let voucherAmount = 0;
    if (total >= 150) voucherAmount = 10;
    else if (total >= 100) voucherAmount = 5;

    return NextResponse.json({
      id: cart.id,
      items,
      subtotal,
      taxAmount,
      shippingCost,
      total,
      voucherAmount,
      discountPercentage,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Fehler beim Laden des Warenkorbs' }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Produkt-ID erforderlich' }, { status: 400 });
    }

    // Check product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });
    }

    if (!product.isAvailableOnline) {
      return NextResponse.json(
        { error: 'Dieses Produkt ist nur in der Filiale erhältlich' },
        { status: 400 }
      );
    }

    if (quantity < product.minimumOrderQuantity) {
      return NextResponse.json(
        { error: `Mindestbestellmenge: ${product.minimumOrderQuantity}` },
        { status: 400 }
      );
    }

    // Get or create active cart
    let cart = await prisma.cart.findFirst({
      where: {
        userId: session.id,
        isActive: true,
        name: null,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.id,
          isActive: true,
        },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stockQuantity) {
        return NextResponse.json(
          { error: `Nur ${product.stockQuantity} verfügbar` },
          { status: 400 }
        );
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Add new item
      if (quantity > product.stockQuantity) {
        return NextResponse.json(
          { error: `Nur ${product.stockQuantity} verfügbar` },
          { status: 400 }
        );
      }

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Fehler beim Hinzufügen zum Warenkorb' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Artikel-ID und Menge erforderlich' },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== session.id) {
      return NextResponse.json({ error: 'Artikel nicht gefunden' }, { status: 404 });
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      if (quantity < cartItem.product.minimumOrderQuantity) {
        return NextResponse.json(
          { error: `Mindestbestellmenge: ${cartItem.product.minimumOrderQuantity}` },
          { status: 400 }
        );
      }

      if (quantity > cartItem.product.stockQuantity) {
        return NextResponse.json(
          { error: `Nur ${cartItem.product.stockQuantity} verfügbar` },
          { status: 400 }
        );
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Warenkorbs' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Artikel-ID erforderlich' }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== session.id) {
      return NextResponse.json({ error: 'Artikel nicht gefunden' }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Fehler beim Entfernen aus dem Warenkorb' },
      { status: 500 }
    );
  }
}
