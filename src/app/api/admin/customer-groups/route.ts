import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerGroups = await prisma.customerGroup.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(customerGroups);
  } catch (error) {
    console.error('Error fetching customer groups:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
