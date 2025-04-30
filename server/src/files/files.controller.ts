import { Controller, Post, Get, Delete, Param, UploadedFile as MulterUploadedFile, UseInterceptors, Body, ParseIntPipe, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateFileDto } from './dto/create-file.dto';
import { extname } from 'path';
import { FilesService } from './files.service';
import { SERVER_URL } from 'src/common/constants/urls.constants';

@Controller('uploaded-files')
export class FilesController {
  constructor(private readonly uploadedFilesService: FilesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateFileDto,
  ) {
    const createUploadedFileDto = {
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      userId: body.userId,
      projectId: body.projectId ?? undefined,
    };

    return this.uploadedFilesService.create(createUploadedFileDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.uploadedFilesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.uploadedFilesService.remove(id);
  }
}
