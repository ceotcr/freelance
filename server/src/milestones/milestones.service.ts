import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from './entities/milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    const project = await this.projectRepository.findOneBy({ id: createMilestoneDto.projectId });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const milestone = this.milestoneRepository.create({
      ...createMilestoneDto,
      project,
    });
    return await this.milestoneRepository.save(milestone);
  }

  async findByProject(projectId: number): Promise<Milestone[]> {
    return this.milestoneRepository.find({
      where: { project: { id: projectId } },
      relations: ['project'],
    });
  }

  async findOne(id: number): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }
    return milestone;
  }

  async update(id: number, updateMilestoneDto: UpdateMilestoneDto): Promise<Milestone> {
    const milestone = await this.findOne(id);
    const updated = this.milestoneRepository.merge(milestone, updateMilestoneDto);
    return await this.milestoneRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const milestone = await this.findOne(id);
    await this.milestoneRepository.remove(milestone);
  }
}