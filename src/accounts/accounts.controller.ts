import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
@ApiBasicAuth()
@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary:'Membuat Rekening Baru'})
  @Post()
  create(@Request() req, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(req.user.userId, createAccountDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.accountsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.accountsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(req.user.userId, id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.accountsService.remove(req.user.userId, id);
  }
}
