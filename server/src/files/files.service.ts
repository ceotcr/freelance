import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadedFile } from 'src/exports/entities';
import { ExtendedCreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(UploadedFile)
    private readonly uploadedFileRepository: Repository<UploadedFile>,
  ) { }

  async create(createUploadedFileDto: ExtendedCreateFileDto): Promise<UploadedFile> {
    const uploadedFile = this.uploadedFileRepository.create(createUploadedFileDto);
    return this.uploadedFileRepository.save(uploadedFile);
  }

  async findAll(): Promise<UploadedFile[]> {
    return this.uploadedFileRepository.find({ relations: ['user', 'project'] });
  }

  async findOne(id: number): Promise<UploadedFile> {
    const file = await this.uploadedFileRepository.findOne({ where: { id }, relations: ['user', 'project'] });
    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return file;
  }

  async remove(id: number): Promise<void> {
    const file = await this.findOne(id);
    await this.uploadedFileRepository.remove(file);
  }
}
