import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    state: string;

    @Column({default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
    user: User;
}
