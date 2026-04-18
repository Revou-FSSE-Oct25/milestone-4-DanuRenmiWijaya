import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true }
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
     const { password, ...result } = user;
    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, email: true, name: true, updatedAt: true }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
      email: email,
      },
    });
  }
}
