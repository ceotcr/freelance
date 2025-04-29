import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from 'src/exports/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Milestone]),
  ],
  controllers: [MilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule { }
