import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoiceRepository.create(createInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async findAll(query: any): Promise<{ data: Invoice[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      projectId,
      freelancerId,
      status,
      sortBy = 'id',
      sortOrder = 'DESC',
    } = query;

    const where: FindOptionsWhere<Invoice> = {};

    if (projectId) where.project = { id: projectId };
    if (freelancerId) where.freelancer = { id: freelancerId };
    if (status) where.status = status;

    const [data, total] = await this.invoiceRepository.findAndCount({
      where,
      take: +limit,
      skip: (+page - 1) * +limit,
      order: {
        [sortBy]: sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      },
      relations: ['freelancer', 'project'],
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['freelancer', 'project'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    Object.assign(invoice, updateInvoiceDto);

    return this.invoiceRepository.save(invoice);
  }

  async remove(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }
}
