import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class UploadedFile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileName: string;

    @Column()
    fileUrl: string;

    @ManyToOne(() => User, user => user.files)
    user: User;

    @ManyToOne(() => Project, project => project.files, { nullable: true })
    project: Project;
}
