import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';

@Entity()
export class LogoutLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.logoutLogs, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    logoutTime: Date;

    @Column()
    ipAddress: string;

    @Column()
    userAgent: string;
}