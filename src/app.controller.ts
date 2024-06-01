import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import {
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      // 어떤 프로퍼티를 가져올 지 (기본은 *)
      // select을 정의하면 정의된 프로퍼티들만 가져온다.
      // select: {
      //   id: true,
      //   profile: {
      //     id: true,
      //   },
      // },
      // where 조건은 기본적으로 AND 조건으로 묶인다.
      // where: [{ id: 3 }, {}], //[] 안에 조건을 여러개 넣어 OR 조건으로 가져올 수 있다.
      where: {
        // 아닌경우
        // id: Not(1),
        // 적은 경우
        // id: LessThan(30),
        // id: LessThanOrEqual(30),
        // id: MoreThan(30)
        // id: MoreThanOrEqual(30)
        // id: Equal(30)
        // email: Like('%google%'),
        // email: ILike('%')
        // id: Between(10, 15),
        // id: In([1, 3, 5]),
        // id: IsNull(),
      },
      // // relation
      // relations: {
      //   profile: true,
      // },

      // // asc, desc
      // order: {
      //   id: 'ASC',
      // },
      // // 처음 몇 개를 제외할지
      // skip: 0,
      // // 몇 개를 가져올 지
      // take: 0, // 0 > 전부다 return
    });
  }

  @Post('users')
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
    // return this.userRepository.save({
    //   title: 'test title',
    // });
  }

  @Post('sample')
  async sample() {
    // create 메서드는 new User() 이랑 같다.
    // 모델에 해당되는 객체 생성 - 저장은 안함
    const url1 = this.userRepository.create({
      email: 'test@codefactory',
    });

    await this.userRepository.save(url1);

    // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에 가져온 값들을 대체함
    // 저장하진 않음
    const user3 = await this.userRepository.preload({
      id: 101,
      email: 'codefactory@codefacot.ai',
    });

    // 삭제하기
    await this.userRepository.delete(101);

    await this.userRepository.increment(
      {
        id: 1,
      },
      'count',
      2,
    );
    await this.userRepository.decrement({ id: 1 }, 'count', 1);
    const count = await this.userRepository.count({
      where: {
        email: ILike('%google'),
      },
    });

    const sum = await this.userRepository.sum('count', {
      email: ILike('%gopogle'),
    });

    const avg = await this.userRepository.average('count', {
      id: LessThan(3),
    });

    const min = await this.userRepository.minimum('count', {
      id: LessThan(4),
    });

    const max = await this.userRepository.maximum('count', {
      id: LessThan($),
    });

    const users = await this.userRepository.find({});
    const userOne = await this.userRepository.findOne({
      where: {
        id: 3,
      },
    });

    const usersAndCount = await this.userRepository.findAndCount({
      take: 3,
    });

    return url1;
  }

  @Patch('users/:id')
  async pathUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });
    return user;
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      title: 'title',
      email: 'email@email.com',
    });

    await this.profileRepository.save({
      profileImg: 'adsdf.jpg',
      user,
    });

    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'hihi@email.com',
    });

    await this.postRepository.save({
      title: 'post 1',
      author: user,
    });

    await this.postRepository.save({
      title: 'post2',
      author: user,
    });
  }

  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'nestjs',
    });
    const post2 = await this.postRepository.save({
      title: 'programming',
    });

    const t1 = await this.tagRepository.save({
      name: 'javascript',
      posts: [post1, post2],
    });
    const t2 = await this.tagRepository.save({
      name: 'typescript',
      posts: [post1],
    });

    await this.postRepository.save({
      title: 'java programming',
      tags: [t1, t2],
    });
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
