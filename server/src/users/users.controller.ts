import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddSkillToUserDto } from './dto/add-skill.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SERVER_URL } from 'src/common/constants/urls.constants';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Post(':id/skills')
  addSkill(@Param('id') id: string, @Body() addSkillToUserDto: AddSkillToUserDto) {
    return this.usersService.addSkill(+id, addSkillToUserDto.skillId);
  }

  @Delete(':id/skills/:skillId')
  removeSkill(@Param('id') id: string, @Param('skillId') skillId: string) {
    return this.usersService.removeSkill(+id, +skillId);
  }

  @Get(':id/skills')
  getSkills(@Param('id') id: string) {
    return this.usersService.getSkills(+id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post(':id/complete-profile')
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      },
    }),
  }))
  async completeProfile(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
    const newDto = {
      ...updateUserDto,
      profilePicture: `/uploads/${file.filename}`,
    }
    return this.usersService.update(id, newDto);
  }
}
