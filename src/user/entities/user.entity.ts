import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../../task/entities/task.entity.js";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    name: string;
    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}
