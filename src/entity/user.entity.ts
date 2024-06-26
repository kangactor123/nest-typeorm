import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  USER,
  ADMIN,
}

@Entity()
export class UserModel {
  // 자동으로 ID를 생성
  // @PrimaryColumn은 모든 테이블에서 기본적으로 존재해야한다.
  // 테이블 안에서 각각의 Row를 구분할 수 있는 칼럼이다.

  // PrimaryGeneratedColumn -> 시퀀스
  // uuid
  @PrimaryGeneratedColumn('uuid')
  id: number;

  // typescript 의 타입을 기반으로 자동으로 추론한다.
  @Column({
    type: 'varchar',
    name: 'title', //프로퍼티 이름으로 자동 유추
    length: 300,
    nullable: false,
    update: false, // true 면 처음 저장할때만 값 지정 가능, 이후에는 값 변경 불가능
    select: true, // find()를 실행할 때 기본으로 값을 불러올지 (default: true)
    default: 'default value', // 기본 값
    unique: false,
  })
  title: string;

  @Column()
  email: string;

  // enum
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // 데이터가 생성되는 날짜와 시간이 자동으로 찍힌다.
  @CreateDateColumn()
  createdAt: Date;

  // 데이터가 수정되는 업데이트되는 날짜와 시간
  @UpdateDateColumn()
  updatedAt: Date;

  // 데이터가 업데이트 될 때마다 1씩 올라간다.
  // 처음 생성되면 값은 1이다.
  // save() 함수가 몇 번 불렸는지 기억한다.
  @VersionColumn()
  version: number;

  @Column()
  @Generated('increment')
  // uuid도 가능
  additionalId: number;

  @OneToOne(() => ProfileModel, (profile) => profile.user, {
    eager: true, // find() 를 실행할 때 마다 항상 함께 가져올 릴레이션
    cascade: true, // 저장할 때 relation 을 한번에 저장 가능
    nullable: true,

    // 관계가 삭제 됐을 떄
    // no action > 아무것도 안함
    // cascade > 참조하는 row도 같이 삭제
    // set null > 참조하는 row에서 참조 id를 null로 변경
    // set default > 기본 셋팅으로 설정 (테이블의 기본 셋팅)
    // restrict > 참조하고 있는 row가 있는 경우 참조 당하는 row 삭제 불가
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];

  @Column({
    default: 0,
  })
  count: number;
}
