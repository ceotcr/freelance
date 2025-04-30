import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFile } from './entities/file.entity';
import { Project, User } from 'src/exports/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedFile, User, Project])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule { }
