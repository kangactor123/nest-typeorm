import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
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
      select: {
        id: true,
        profile: {
          id: true,
        },
      },
      // where 조건은 기본적으로 AND 조건으로 묶인다.
      // where: [{ id: 3 }, {}], //[] 안에 조건을 여러개 넣어 OR 조건으로 가져올 수 있다.
      where: {
        profile: {
          id: 4,
        },
      },
      // relation
      relations: {
        profile: true,
      },

      // asc, desc
      order: {
        id: 'ASC',
      },
      // 처음 몇 개를 제외할지
      skip: 0,
      // 몇 개를 가져올 지
      take: 0, // 0 > 전부다 return
    });
  }

  @Post('users')
  postUser() {
    return this.userRepository.save({
      title: 'test title',
    });
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
