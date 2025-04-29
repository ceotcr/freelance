import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, Like } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(query: any): Promise<{ data: Project[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      clientId,
      budgetMin,
      budgetMax,
      title,
      sortBy = 'postedAt',
      sortOrder = 'DESC',
    } = query;

    const where: FindOptionsWhere<Project> = {};

    if (clientId) where.client = { id: clientId };
    if (title) where.title = Like(`%${title}%`);
    if (budgetMin && budgetMax) where.budget = Between(budgetMin, budgetMax);

    const [data, total] = await this.projectRepository.findAndCount({
      where,
      take: +limit,
      skip: (+page - 1) * +limit,
      order: {
        [sortBy]: sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      },
      relations: ['client', 'bids', 'milestones', 'messages', 'files', 'invoices'],
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'bids', 'milestones', 'messages', 'files', 'invoices'],
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    Object.assign(project, updateProjectDto);

    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }
}
