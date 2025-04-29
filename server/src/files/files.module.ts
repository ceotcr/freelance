import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFile } from './entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedFile])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule { }
