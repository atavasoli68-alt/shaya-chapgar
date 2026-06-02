import prisma from '@/lib/prisma';
import { hashPassword, comparePassword } from '@/lib/auth';
import { ApiError } from '@/lib/errors';
import type { RegisterInput } from '@/lib/validations';

/**
 * ─── User Repository ───────────────────────────────────────────────
 */
export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
  }

  async findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: RegisterInput) {
    const hashed = await hashPassword(data.password);
    return prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async updateRole(id: string, role: string) {
    return prisma.user.update({ where: { id }, data: { role } });
  }
}

/**
 * ─── User Service ──────────────────────────────────────────────────
 */
export class UserService {
  private repo = new UserRepository();

  async register(data: RegisterInput) {
    const exists = await this.repo.findByEmail(data.email);
    if (exists) throw ApiError.conflict('این ایمیل قبلاً ثبت شده است');
    return this.repo.create(data);
  }

  async authenticate(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw ApiError.unauthorized();
    const valid = await comparePassword(password, user.password);
    if (!valid) throw ApiError.unauthorized();
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async getAllUsers() {
    return this.repo.findAll();
  }
}

export const userRepository = new UserRepository();
export const userService = new UserService();
