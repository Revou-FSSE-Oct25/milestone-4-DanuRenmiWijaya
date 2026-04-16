// src/transactions/transactions.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransferDto } from './dto/transfer.dto';
import { DepositWithdrawDto } from './dto/deposit-withdraw.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // 1. DEPOSIT
  async deposit(userId: string, dto: DepositWithdrawDto) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({ where: { id: dto.accountId, userId } });
      if (!account) throw new NotFoundException('Rekening tidak ditemukan');

      // Update Saldo
      const updatedAccount = await tx.account.update({
        where: { id: dto.accountId },
        data: { balance: { increment: dto.amount } },
      });

      // Catat Transaksi
      return tx.transaction.create({
        data: {
          amount: dto.amount,
          type: 'DEPOSIT',
          accountId: dto.accountId,
          description: 'Setoran Tunai',
        },
      });
    });
  }

  // 2. WITHDRAW
  async withdraw(userId: string, dto: DepositWithdrawDto) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({ where: { id: dto.accountId, userId } });
      if (!account) throw new NotFoundException('Rekening tidak ditemukan');
      if (Number(account.balance) < Number(dto.amount)) throw new BadRequestException('Saldo tidak mencukupi');

      await tx.account.update({
        where: { id: dto.accountId },
        data: { balance: { decrement: dto.amount } },
      });

      return tx.transaction.create({
        data: {
          amount: dto.amount,
          type: 'WITHDRAW',
          accountId: dto.accountId,
          description: 'Penarikan Tunai',
        },
      });
    });
  }

  // 3. TRANSFER (ACID Transaction)
  async transfer(userId: string, dto: TransferDto) {
    return this.prisma.$transaction(async (tx) => {
      // Cek pengirim
      const sender = await tx.account.findFirst({ where: { id: dto.senderAccountId, userId } });
      if (!sender) throw new NotFoundException('Rekening pengirim tidak ditemukan');
      if (Number(sender.balance) < Number(dto.amount)) throw new BadRequestException('Saldo tidak mencukupi');

      // Cek penerima berdasarkan nomor rekening
      const receiver = await tx.account.findUnique({ where: { accountNumber: dto.receiverAccountNumber } });
      if (!receiver) throw new NotFoundException('Rekening tujuan tidak ditemukan');

      // Eksekusi potong saldo & tambah saldo
      await tx.account.update({ where: { id: sender.id }, data: { balance: { decrement: dto.amount } } });
      await tx.account.update({ where: { id: receiver.id }, data: { balance: { increment: dto.amount } } });

      // Catat riwayat di kedua belah pihak
      return tx.transaction.create({
        data: {
          amount: dto.amount,
          type: 'TRANSFER',
          accountId: sender.id,
          relatedAccountId: receiver.id,
          description: `Transfer ke ${receiver.accountNumber}`,
        },
      });
    });
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { account: { userId } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
