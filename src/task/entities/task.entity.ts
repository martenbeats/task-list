import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatusType } from "../../core/enums.js";
import { User } from "../../user/entities/user.entity.js";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string
    @Column()
    description: string
    @Column({ default: StatusType.pending })
    status: StatusType
    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: number;
}
