import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import type { SessionUser } from '@/types';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';
const TOKEN_EXPIRY = '7d';
const COOKIE_NAME = 'mcpaper_session';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: SessionUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = generateToken(user);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyToken(token);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { customerGroup: true },
  });

  return user;
}

export async function getAdminSession(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session || !session.isAdmin) return null;
  return session;
}

// Admin authentication
export async function authenticateAdmin(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const admin = await prisma.adminUser.findUnique({
    where: { email, isActive: true },
  });

  if (!admin) return null;

  const isValid = await verifyPassword(password, admin.passwordHash);
  if (!isValid) return null;

  // Update last login
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  });

  return {
    id: admin.id,
    email: admin.email,
    firstName: admin.name.split(' ')[0] || admin.name,
    lastName: admin.name.split(' ').slice(1).join(' ') || '',
    customerNumber: '',
    discountPercentage: 0,
    isAdmin: true,
    adminRole: admin.role,
  };
}

// Customer authentication
export async function authenticateUser(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
    include: { customerGroup: true },
  });

  if (!user) return null;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    customerNumber: user.customerNumber,
    customerGroupId: user.customerGroupId || undefined,
    discountPercentage: user.customerGroup?.discountPercentage
      ? Number(user.customerGroup.discountPercentage)
      : 0,
  };
}

// Register new user
export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  isVerifiedBusiness?: boolean;
  phone?: string;
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
}): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  try {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return { success: false, error: 'E-Mail-Adresse bereits registriert' };
    }

    // Get default customer group (Standard)
    const defaultGroup = await prisma.customerGroup.findFirst({
      where: { name: 'Standard' },
    });

    // Generate customer number
    let customerNumber: string;
    let isUnique = false;
    do {
      const random = Math.floor(100000 + Math.random() * 900000);
      customerNumber = `MC-${random}`;
      const existing = await prisma.user.findUnique({
        where: { customerNumber },
      });
      isUnique = !existing;
    } while (!isUnique);

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        customerNumber,
        customerGroupId: defaultGroup?.id,
        isVerifiedBusiness: data.isVerifiedBusiness || false,
        phone: data.phone,
        billingStreet: data.billingStreet,
        billingCity: data.billingCity,
        billingPostalCode: data.billingPostalCode,
        billingCountry: 'Deutschland',
        shippingCountry: 'Deutschland',
      },
      include: { customerGroup: true },
    });

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      customerNumber: user.customerNumber,
      customerGroupId: user.customerGroupId || undefined,
      discountPercentage: user.customerGroup?.discountPercentage
        ? Number(user.customerGroup.discountPercentage)
        : 0,
    };

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registrierung fehlgeschlagen' };
  }
}
