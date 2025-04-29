import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
  ) { }

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const bid = this.bidRepository.create(createBidDto);
    return this.bidRepository.save(bid);
  }

  async findAll(query: any): Promise<{ data: Bid[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      freelancerId,
      projectId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where: FindOptionsWhere<Bid> = {};

    if (freelancerId) where.freelancer = { id: freelancerId };
    if (projectId) where.project = { id: projectId };

    const [data, total] = await this.bidRepository.findAndCount({
      where,
      take: +limit,
      skip: (+page - 1) * +limit,
      order: {
        [sortBy]: sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      },
      relations: ['freelancer', 'project'],
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Bid> {
    const bid = await this.bidRepository.findOne({
      where: { id },
      relations: ['freelancer', 'project'],
    });

    if (!bid) {
      throw new NotFoundException(`Bid with id ${id} not found`);
    }

    return bid;
  }

  async update(id: number, updateBidDto: UpdateBidDto): Promise<Bid> {
    const bid = await this.findOne(id);

    Object.assign(bid, updateBidDto);

    return this.bidRepository.save(bid);
  }

  async remove(id: number): Promise<void> {
    const bid = await this.findOne(id);
    await this.bidRepository.remove(bid);
  }
}
