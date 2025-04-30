import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadedFile } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(UploadedFile)
    private readonly fileRepository: Repository<UploadedFile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(createFileDto: CreateFileDto): Promise<UploadedFile> {
    const user = await this.userRepository.findOneBy({ id: createFileDto.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const file = this.fileRepository.create({
      fileName: createFileDto.fileName,
      fileUrl: createFileDto.fileUrl,
      user,
    });

    if (createFileDto.projectId) {
      const project = await this.projectRepository.findOneBy({ id: createFileDto.projectId });
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      file.project = project;
    }

    return await this.fileRepository.save(file);
  }

  async findByProject(projectId: number): Promise<UploadedFile[]> {
    return this.fileRepository.find({
      where: { project: { id: projectId } },
      relations: ['user', 'project'],
    });
  }

  async findByUser(userId: number): Promise<UploadedFile[]> {
    return this.fileRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'project'],
    });
  }

  async findOne(id: number): Promise<UploadedFile> {
    const file = await this.fileRepository.findOne({
      where: { id },
      relations: ['user', 'project'],
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async remove(id: number): Promise<void> {
    const file = await this.findOne(id);
    await this.fileRepository.remove(file);
  }
}