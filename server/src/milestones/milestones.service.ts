import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Milestone, MilestoneStatus } from './entities/milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
  ) { }

  async create(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    const milestone = this.milestoneRepository.create(createMilestoneDto);
    return this.milestoneRepository.save(milestone);
  }

  async findAll(query: any): Promise<{ data: Milestone[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      projectId,
      status,
      sortBy = 'id',
      sortOrder = 'DESC',
    } = query;

    const where: FindOptionsWhere<Milestone> = {};

    if (projectId) where.project = { id: projectId };
    if (status) where.status = status;

    const [data, total] = await this.milestoneRepository.findAndCount({
      where,
      take: +limit,
      skip: (+page - 1) * +limit,
      order: {
        [sortBy]: sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      },
      relations: ['project'],
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with id ${id} not found`);
    }

    return milestone;
  }

  async update(id: number, updateMilestoneDto: UpdateMilestoneDto): Promise<Milestone> {
    const milestone = await this.findOne(id);

    Object.assign(milestone, updateMilestoneDto);

    return this.milestoneRepository.save(milestone);
  }

  async remove(id: number): Promise<void> {
    const milestone = await this.findOne(id);
    await this.milestoneRepository.remove(milestone);
  }
}
