import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, In } from 'typeorm';
import { User, Skill } from 'src/exports/entities';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: createUserDto.username }, { email: createUserDto.email }],
    });

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username already exists');
      }
      throw new ConflictException('Email already exists');
    }

    const skills = createUserDto.skills
      ? await this.skillRepository.findBy({ id: In(JSON.parse(createUserDto.skills)) })
      : [];
    const user = this.userRepository.create({ ...createUserDto, skills });
    return this.userRepository.save(user);
  }

  async findAll(query: any): Promise<{ data: User[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      role,
      email,
      username,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where: FindOptionsWhere<User> = {};

    if (role) where.role = role;
    if (email) where.email = Like(`%${email}%`);
    if (username) where.username = Like(`%${username}%`);

    const [data, total] = await this.userRepository.findAndCount({
      where,
      take: +limit,
      skip: (+page - 1) * +limit,
      order: {
        [sortBy]: sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      },
      relations: ['skills'],
    });

    return { data, total };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['skills', 'projects', 'bids', 'messages', 'files', 'invoices'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async getUserByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let skills = [] as Skill[];
    if (updateUserDto.skills) {
      skills = await this.skillRepository.findBy({ id: In(JSON.parse(updateUserDto.skills)) })
    }
    const user = await this.userRepository.preload({ id, ...updateUserDto, skills });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...woutPswd } = await this.userRepository.save(user)
    return woutPswd
  }
}
