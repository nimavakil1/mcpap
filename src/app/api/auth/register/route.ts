import { NextRequest, NextResponse } from 'next/server';
import { registerUser, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      companyName,
      phone,
      billingStreet,
      billingCity,
      billingPostalCode,
      isVerifiedBusiness,
    } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Bitte füllen Sie alle Pflichtfelder aus' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Das Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    const result = await registerUser({
      email,
      password,
      firstName,
      lastName,
      companyName,
      phone,
      billingStreet,
      billingCity,
      billingPostalCode,
      isVerifiedBusiness: isVerifiedBusiness || false,
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Registrierung fehlgeschlagen' },
        { status: 400 }
      );
    }

    await setSessionCookie(result.user);

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        customerNumber: result.user.customerNumber,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registrierung fehlgeschlagen' },
      { status: 500 }
    );
  }
}
