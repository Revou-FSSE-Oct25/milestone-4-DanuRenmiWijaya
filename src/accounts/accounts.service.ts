// src/accounts/accounts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  // POST /accounts
  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        accountNumber: dto.accountNumber,
        balance: dto.initialBalance,
        userId: userId,
      },
    });
  }

  // GET /accounts 
  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }

  // GET /accounts/:id
  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
      include: { transactions: true },
    });
    if (!account) throw new NotFoundException('Rekening tidak ditemukan');
    return account;
  }

  // PATCH /accounts/:id
  async update(userId: string, id: string, dto: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { id, userId },
      data: dto,
    });
  }

  // DELETE /accounts/:id
  async remove(userId: string, id: string) {
    return this.prisma.account.delete({
      where: { id, userId },
    });
  }
}
