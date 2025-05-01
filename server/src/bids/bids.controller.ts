import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/exports/entities';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) { }

  @Post()
  async create(@Body() createBidDto: CreateBidDto) {
    return this.bidsService.create(createBidDto);
  }

  @Get('my-bids')
  async findMyBids(@GetUser() user: User) {
    if (!user) throw new UnauthorizedException('User not found');
    return this.bidsService.findByFreelancer(user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.findOne(id);
  }

  @Post('my-bids')
  async findByFreelancer(@Body('id', ParseIntPipe) id: number) {
    return this.bidsService.findByFreelancer(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBidDto: UpdateBidDto) {
    return this.bidsService.update(id, updateBidDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.bidsService.remove(id);
  }
}
