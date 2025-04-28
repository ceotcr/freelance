import { LogoutLog } from 'src/auth/entities/logout-logs.entity';
import { Bid } from 'src/bids/entities/bid.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { UploadedFile } from 'src/files/entities/file.entity';

export enum UserRole {
    CLIENT = 'client',
    FREELANCER = 'freelancer',
    ADMIN = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    username: string;

    @Column()
    profilePicture: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
    })
    role: UserRole;

    @OneToMany(() => Project, project => project.client)
    projects: Project[];

    @OneToMany(() => Bid, bid => bid.freelancer)
    bids: Bid[];

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

    @OneToMany(() => UploadedFile, file => file.user)
    files: UploadedFile[];

    @OneToMany(() => Invoice, invoice => invoice.freelancer)
    invoices: Invoice[];

    @ManyToMany(() => Skill, skill => skill.users, { cascade: true })
    @JoinTable()
    skills: Skill[];

    @OneToOne(() => LogoutLog, logoutLog => logoutLog.user, { cascade: true })
    logoutLogs: LogoutLog;
}
