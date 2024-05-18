import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.entity';

// OneToMany, ManyToOne 관계는 해당 model의 입장에서 설계가 된다.
@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  // ManyToOne 관계를 맺어주면 ManyToOne 입장에서 id를 들고 있게 된다.
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  @Column()
  title: string;
}
