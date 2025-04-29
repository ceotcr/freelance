import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) { }

  create(createSkillDto: CreateSkillDto) {
    const skill = this.skillRepository.create(createSkillDto);
    return this.skillRepository.save(skill);
  }

  findAll() {
    return this.skillRepository.find();
  }

  findOne(id: number) {
    return this.skillRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    await this.skillRepository.update(id, updateSkillDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const skill = await this.findOne(id);
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return this.skillRepository.remove(skill);
  }
}
