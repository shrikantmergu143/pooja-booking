import * as bcrypt from 'bcrypt';
import { AdminRole } from '../../common/enums/admin-role.enum';
import { User } from '../../users/entities/user.entity';
import { AppDataSource } from '../data-source';

async function main() {
  const name = process.env.INITIAL_SUPER_ADMIN_NAME?.trim();
  const email = process.env.INITIAL_SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_SUPER_ADMIN_PASSWORD;
  if (!name || !email || !password) {
    throw new Error(
      'Set INITIAL_SUPER_ADMIN_NAME, INITIAL_SUPER_ADMIN_EMAIL, and INITIAL_SUPER_ADMIN_PASSWORD in backend/.env.',
    );
  }
  if (password.length < 8) {
    throw new Error('INITIAL_SUPER_ADMIN_PASSWORD must be at least 8 characters.');
  }

  await AppDataSource.initialize();
  try {
    const users = AppDataSource.getRepository(User);
    if (await users.count()) {
      throw new Error('Admin accounts already exist. Use the authenticated admin/create API instead.');
    }
    const user = users.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    });
    await users.save(user);
    console.log(`Created initial SUPER_ADMIN account for ${email}.`);
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((error) => {
  console.error('Super administrator bootstrap failed:', error);
  process.exitCode = 1;
});
