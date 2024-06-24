import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './schemas/post.schema';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../auth/schemas/user.schema';
import { CreatePostDTO } from './dto/createPost.dto';
import { UpdatePostDTO } from './dto/updatePost.dto';

describe('PostsService', () => {
  let postService: PostsService;
  let model: Model<Post>;

  const mockPostService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'newUser',
    email: 'newUser@gmail.com',
    password: '12345678',
    role: 'user',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as User;

  const mockPost = {
    _id: '61c0ccf11d7bf83d153d7c70',
    title: 'Nuevo post',
    body: 'No hay',
    posted_by: mockUser._id,
    created_at: new Date(),
    updated_at: new Date(),
  } as unknown as Post;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostService,
        },
      ],
    }).compile();

    postService = module.get<PostsService>(PostsService);
    model = module.get<Model<Post>>(getModelToken(Post.name));
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const query = { page: '1', keyword: 'test' };

      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({ skip: jest.fn().mockResolvedValue([mockPost]) }),
          }) as any,
      );

      const result = await postService.getAll(query);

      expect(model.find).toHaveBeenCalledWith({
        $or: [
          { title: { $regex: query.keyword, $options: 'i' } },
          { keywords: { $regex: query.keyword, $options: 'i' } },
        ],
      });

      expect(result).toEqual([mockPost]);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'Nuevo post',
        body: 'No hay',
        posted_by: mockUser._id,
      } as unknown as CreatePostDTO;

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve([mockPost]));

      const result = await postService.create(
        newPost as CreatePostDTO,
        mockUser as User,
      );

      expect(result).toEqual([mockPost]);
    });
  });

  describe('findById', () => {
    it('should return a post', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockPost);

      const result = await postService.getOne(mockPost._id);

      expect(model.findById).toHaveBeenCalledWith(mockPost._id);

      expect(result).toEqual(mockPost);
    });

    it('should throw an error if ID is invalid', async () => {
      const id = 'invalidId';
      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);
      await expect(postService.getOne(id)).rejects.toThrow(BadRequestException);

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('should trhow NotFoundExeption if post is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(postService.getOne(mockPost._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockPost._id);
    });
  });

  describe('updateById', () => {
    it('should update a post', async () => {
      const updatePost = {
        ...mockPost,
        title: 'Updated post',
      } as UpdatePostDTO;
      const resource = { title: 'Update post' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatePost);

      const result = await postService.updateById(
        mockPost._id,
        resource as UpdatePostDTO,
      );

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPost._id,
        resource,
        {
          new: true,
          runValidators: true,
        },
      );

      expect(result.title).toEqual(updatePost.title);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockPost);

      const result = await postService.delete(mockPost._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockPost._id);

      expect(result).toEqual(mockPost);
    });
  });
});
