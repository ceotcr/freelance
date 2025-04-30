import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/exports/entities';
import { BidsModule } from 'src/bids/bids.module';
import { FilesModule } from 'src/files/files.module';
import { InvoicesModule } from 'src/invoices/invoices.module';
import { MilestonesModule } from 'src/milestones/milestones.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), MilestonesModule, InvoicesModule, BidsModule, FilesModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule { }
