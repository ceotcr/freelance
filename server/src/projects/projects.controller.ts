import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FilterProjectsDto } from './dto/filter-projects.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMilestoneDto } from '../milestones/dto/create-milestone.dto';
import { CreateInvoiceDto } from '../invoices/dto/create-invoice.dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @Roles(UserRole.CLIENT)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterProjectsDto
  ) {
    const validatedPagination = {
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
      sortBy: paginationDto.sortBy || 'postedAt',
      sortOrder: paginationDto.sortOrder || 'DESC'
    };

    return this.projectsService.findAll(validatedPagination, filterDto);
  }

  @Get('my-projects')
  @Roles(UserRole.CLIENT)
  findMyProjects(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User,
  ) {
    return this.projectsService.findMyProjects(paginationDto, user);
  }

  @Get("freelancer-projects")
  @Roles(UserRole.FREELANCER)
  findFreelancerProjects(
    @GetUser() user: User,
  ) {
    return this.projectsService.findFreelancerProjects(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.CLIENT)
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: User,
  ) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.projectsService.remove(+id);
  }

  @Post(':id/files')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.CLIENT, UserRole.FREELANCER)
  addFile(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|doc|docx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.projectsService.addFile(+id, file, user);
  }

  @Get(':id/files')
  getFiles(@Param('id') id: string, @GetUser() user: User) {
    if (!user) {
      throw new UnauthorizedException()
    }
    return this.projectsService.getProjectFiles(+id, user.id);
  }

  @Post(':id/milestones')
  @Roles(UserRole.CLIENT)
  addMilestone(
    @Param('id') id: string,
    @Body() createMilestoneDto: CreateMilestoneDto,
    @GetUser() user: User,
  ) {
    return this.projectsService.addMilestone(+id, createMilestoneDto);
  }

  @Put(':id/milestones/:milestoneId/complete')
  @Roles(UserRole.FREELANCER)
  completeMilestone(
    @Param('id') id: string,
    @Param('milestoneId') milestoneId: string,
    @GetUser() user: User,
  ) {
    return this.projectsService.completeMilestone(+id, +milestoneId);
  }

  @Put(':id/milestones/:milestoneId/approve')
  @Roles(UserRole.CLIENT)
  approveMilestone(
    @Param('id') id: string,
    @Param('milestoneId') milestoneId: string,
    @GetUser() user: User,
  ) {
    return this.projectsService.approveMilestone(+id, +milestoneId);
  }

  @Get(':id/milestones')
  getMilestones(@Param('id') id: string) {
    return this.projectsService.getProjectMilestones(+id);
  }

  @Post(':id/invoices')
  @Roles(UserRole.FREELANCER)
  generateInvoice(
    @Param('id') id: string,
    @Body() createInvoiceDto: CreateInvoiceDto,
    @GetUser() user: User,
  ) {
    return this.projectsService.generateInvoice(+id, createInvoiceDto, user);
  }

  @Get(':id/invoices')
  getInvoices(@Param('id') id: string) {
    return this.projectsService.getProjectInvoices(+id);
  }

  @Post(':id/assign/:bidId')
  @Roles(UserRole.CLIENT)
  assignFreelancer(
    @Param('id') id: string,
    @Param('bidId') bidId: string,
    @GetUser() user: User,
  ) {
    return this.projectsService.assignFreelancer(+id, +bidId);
  }

  @Get(':id/bids')
  getBids(@Param('id') id: string) {
    return this.projectsService.getProjectBids(+id);
  }
}