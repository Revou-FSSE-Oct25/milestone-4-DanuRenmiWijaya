import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from 'prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe } from 'node:test';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;

  // Mocking Prisma Transaction
  const mockPrisma = {
    $transaction: jest.fn((callback) => callback(mockPrisma)),
    account: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transfer', () => {
    const mockUserId = 'user-1';
    const mockTransferDto = {
      senderAccountId: 'acc-1',
      receiverAccountNumber: '999888',
      amount: '500.00',
    };

    it('harus berhasil melakukan transfer jika saldo cukup', async () => {
      // 1. Mock Pengirim
      mockPrisma.account.findFirst.mockResolvedValue({
        id: 'acc-1',
        balance: '1000.00',
        userId: mockUserId,
      });

      // 2. Mock Penerima
      mockPrisma.account.findUnique.mockResolvedValue({
        id: 'acc-2',
        accountNumber: '999888',
        balance: '0.00',
      });

      // 3. Mock Hasil Akhir Transaksi
      mockPrisma.transaction.create.mockResolvedValue({ id: 'trx-101', ...mockTransferDto });

      const result = await service.transfer(mockUserId, mockTransferDto);

      expect(result).toBeDefined();
      expect(mockPrisma.account.update).toHaveBeenCalledTimes(2); // Potong & Tambah saldo
      expect(mockPrisma.transaction.create).toHaveBeenCalled();
    });

    it('harus melempar BadRequestException jika saldo tidak mencukupi', async () => {
      // Mock Pengirim dengan saldo kecil
      mockPrisma.account.findFirst.mockResolvedValue({
        id: 'acc-1',
        balance: '100.00', 
        userId: mockUserId,
      });

      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-2' });

      await expect(service.transfer(mockUserId, mockTransferDto))
        .rejects
        .toThrow(BadRequestException);
      
      // Pastikan saldo tidak pernah di-update
      expect(mockPrisma.account.update).not.toHaveBeenCalled();
    });

    it('harus melempar NotFoundException jika rekening tujuan tidak ada', async () => {
      mockPrisma.account.findFirst.mockResolvedValue({ id: 'acc-1', balance: '1000' });
      
      // Mock rekening tujuan null
      mockPrisma.account.findUnique.mockResolvedValue(null);

      await expect(service.transfer(mockUserId, mockTransferDto))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
