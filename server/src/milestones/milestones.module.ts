import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone, Project } from 'src/exports/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Milestone, Project]),
  ],
  controllers: [MilestonesController],
  providers: [MilestonesService],
  exports: [MilestonesService],
})
export class MilestonesModule { }
