import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FilterProjectsDto } from './dto/filter-projects.dto';
import { MilestonesService } from '../milestones/milestones.service';
import { FilesService } from '../files/files.service';
import { InvoicesService } from '../invoices/invoices.service';
import { BidsService } from '../bids/bids.service';
import { User } from '../users/entities/user.entity';
import { CreateMilestoneDto } from '../milestones/dto/create-milestone.dto';
import { CreateInvoiceDto } from '../invoices/dto/create-invoice.dto';
import { Milestone, MilestoneStatus } from '../milestones/entities/milestone.entity';
import { Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { Invoice, UploadedFile, Bid } from 'src/exports/entities';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly milestonesService: MilestonesService,
    private readonly filesService: FilesService,
    private readonly invoicesService: InvoicesService,
    private readonly bidsService: BidsService,
  ) { }

  async create(createProjectDto: CreateProjectDto, client: User): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      client,
    });
    return await this.projectRepository.save(project);
  }

  async findAll(paginationDto?: PaginationDto, filterDto?: FilterProjectsDto): Promise<{ data: Project[]; count: number }> {
    const { page = 1, limit = 10, sortBy = 'postedAt', sortOrder = 'DESC' } = paginationDto || {};
    const { search, minBudget, maxBudget, startDate, endDate } = filterDto || {};

    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`project.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    if (search) {
      query.where([
        { title: Like(`%${search}%`) },
        { description: Like(`%${search}%`) }
      ]);
    }

    if (minBudget !== undefined && maxBudget !== undefined) {
      query.andWhere({ budget: Between(minBudget, maxBudget) });
    } else if (minBudget !== undefined) {
      query.andWhere({ budget: MoreThanOrEqual(minBudget) });
    } else if (maxBudget !== undefined) {
      query.andWhere({ budget: LessThanOrEqual(maxBudget) });
    }

    if (startDate && endDate) {
      query.andWhere({ postedAt: Between(new Date(startDate), new Date(endDate)) });
    }

    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }

  async findMyProjects(paginationDto: PaginationDto, client: User): Promise<{ data: Project[]; count: number }> {
    const { page = 1, limit = 10, sortBy = 'postedAt', sortOrder = 'DESC' } = paginationDto || {};

    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .where('project.clientId = :clientId', { clientId: client.id })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`project.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'bids', 'milestones', 'files', 'invoices', 'messages'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    const updated = this.projectRepository.merge(project, updateProjectDto);
    return await this.projectRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  async addMilestone(projectId: number, createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    const project = await this.findOne(projectId);
    return this.milestonesService.create({
      ...createMilestoneDto,
      projectId: project.id,
    });
  }

  async generateInvoice(projectId: number, createInvoiceDto: CreateInvoiceDto, freelancer: User): Promise<Invoice> {
    const project = await this.findOne(projectId);
    return this.invoicesService.create({
      ...createInvoiceDto,
      projectId: project.id,
      freelancerId: freelancer.id,
    });
  }

  async addFile(projectId: number, file: Express.Multer.File, user: User): Promise<UploadedFile> {
    const project = await this.findOne(projectId);
    return this.filesService.create({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      projectId: project.id,
      userId: user.id,
    });
  }

  async assignFreelancer(projectId: number, bidId: number): Promise<Project> {
    const project = await this.findOne(projectId);
    const bid = await this.bidsService.findOne(bidId);

    if (bid.project.id !== project.id) {
      throw new NotFoundException('Bid does not belong to this project');
    }

    // Accept the bid
    await this.bidsService.update(bidId, { status: 'accepted' });

    // Reject other bids
    await this.bidsService.rejectOtherBids(projectId, bidId);

    // Update project status
    return this.update(projectId, {
      status: 'in_progress',
    });
  }

  async completeMilestone(projectId: number, milestoneId: number): Promise<Milestone> {
    await this.findOne(projectId); // Verify project exists
    return this.milestonesService.update(milestoneId, {
      status: MilestoneStatus.COMPLETED,
    });
  }

  async approveMilestone(projectId: number, milestoneId: number): Promise<Milestone> {
    await this.findOne(projectId); // Verify project exists
    return this.milestonesService.update(milestoneId, {
      status: MilestoneStatus.APPROVED,
    });
  }

  async getProjectFiles(projectId: number): Promise<UploadedFile[]> {
    await this.findOne(projectId); // Verify project exists
    return this.filesService.findByProject(projectId);
  }

  async getProjectMilestones(projectId: number): Promise<Milestone[]> {
    await this.findOne(projectId); // Verify project exists
    return this.milestonesService.findByProject(projectId);
  }

  async getProjectInvoices(projectId: number): Promise<Invoice[]> {
    await this.findOne(projectId); // Verify project exists
    return this.invoicesService.findByProject(projectId);
  }

  async getProjectBids(projectId: number): Promise<Bid[]> {
    await this.findOne(projectId); // Verify project exists
    return this.bidsService.findByProject(projectId);
  }
}