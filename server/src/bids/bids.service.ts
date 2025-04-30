import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(createBidDto: CreateBidDto): Promise<Bid> {
    const freelancer = await this.userRepository.findOneBy({ id: createBidDto.freelancerId });
    if (!freelancer) {
      throw new NotFoundException('Freelancer not found');
    }

    const project = await this.projectRepository.findOneBy({ id: createBidDto.projectId });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const bid = this.bidRepository.create({
      amount: createBidDto.amount,
      proposal: createBidDto.proposal,
      freelancer,
      project,
      status: 'pending',
    });

    return await this.bidRepository.save(bid);
  }

  async findByProject(projectId: number): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { project: { id: projectId } },
      relations: ['freelancer', 'project'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByFreelancer(id: number): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { freelancer: { id } },
      relations: ['freelancer', 'project'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Bid> {
    const bid = await this.bidRepository.findOne({
      where: { id },
      relations: ['freelancer', 'project'],
    });
    if (!bid) {
      throw new NotFoundException('Bid not found');
    }
    return bid;
  }

  async update(id: number, updateBidDto: UpdateBidDto): Promise<Bid> {
    const bid = await this.findOne(id);
    const updated = this.bidRepository.merge(bid, updateBidDto);
    if (updateBidDto.status == 'accepted') {
      await this.projectRepository.update(
        { id: bid.project.id },
        { status: 'in_progress' },
      );
      await this.rejectOtherBids(bid.project.id, bid.id);
    }
    await this.bidRepository.save(updated);
    const newBid = await this.bidRepository.findOne({
      where: { id },
      relations: ['freelancer', 'project'],
    });
    if (!newBid) {
      throw new NotFoundException('Bid not found');
    }
    return newBid;
  }

  async rejectOtherBids(projectId: number, acceptedBidId: number): Promise<void> {
    await this.bidRepository.update(
      { project: { id: projectId }, id: Not(acceptedBidId) },
      { status: 'rejected' },
    );
  }

  async remove(id: number): Promise<void> {
    const bid = await this.findOne(id);
    await this.bidRepository.remove(bid);
  }
}