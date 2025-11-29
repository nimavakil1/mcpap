import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(email, password);

    if (!admin) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten' },
        { status: 401 }
      );
    }

    await setSessionCookie(admin);

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.firstName,
        role: admin.adminRole,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Anmeldung fehlgeschlagen' },
      { status: 500 }
    );
  }
}
