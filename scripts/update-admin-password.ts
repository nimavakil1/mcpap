import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const newPassword = 'General2025!';
  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.adminUser.update({
    where: { email: 'general@distri-smart.com' },
    data: { passwordHash },
  });

  console.log('✅ Password updated successfully!');
  console.log('Email: general@distri-smart.com');
  console.log('Password: General2025!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
