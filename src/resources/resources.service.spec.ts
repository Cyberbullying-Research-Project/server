import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from './resources.service';
import { Resource } from './schemas/resource.schema';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../auth/schemas/user.schema';
import { CreateResourceDTO } from './dto/createResource.dto';
import { UpdateResourceDTO } from './dto/updateResource.dto';

describe('ResourcesService', () => {
  let resourceService: ResourcesService;
  let model: Model<Resource>;

  const mockResourceService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'newUser',
    email: 'newUser@email.com',
    password: '12345678',
    role: 'user',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as User;

  const mockResource = {
    _id: '61c0ccf11d7bf83d153d7c70',
    name: 'Nuevo recurso',
    description: 'No hay',
    path: '/home',
    type: 'mpeg',
    size: 134556,
    created_by: mockUser._id,
    created_at: new Date(),
    updated_at: new Date(),
  } as unknown as Resource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: getModelToken(Resource.name),
          useValue: mockResourceService,
        },
      ],
    }).compile();

    resourceService = module.get<ResourcesService>(ResourcesService);
    model = module.get<Model<Resource>>(getModelToken(Resource.name));
  });

  describe('findAll', () => {
    it('should return an array of resources', async () => {
      const query = { page: '1', keyword: 'test' };

      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockResource]),
            }),
          }) as any,
      );

      const result = await resourceService.getAll(query);

      expect(model.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: query.keyword, $options: 'i' } },
          { description: { $regex: query.keyword, $options: 'i' } },
          { keywords: { $regex: query.keyword, $options: 'i' } },
        ],
      });

      expect(result).toEqual([mockResource]);
    });
  });

  describe('create', () => {
    it('should create a new resource', async () => {
      const newResource = {
        name: 'Nuevo recurso',
        description: 'No hay',
        path: '/home',
        type: 'mpeg',
        size: 134556,
        created_by: mockUser._id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve([mockResource]));

      const result = await resourceService.create(
        newResource as unknown as CreateResourceDTO,
        mockUser as User,
      );

      expect(result).toEqual([mockResource]);
    });
  });

  describe('findById', () => {
    it('should find and return a resource by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockResource);

      const result = await resourceService.getOne(mockResource._id);

      expect(model.findById).toHaveBeenCalledWith(mockResource._id);

      expect(result).toEqual(mockResource);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalidId';
      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);
      await expect(resourceService.getOne(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('should trhow NotFoundExeption if resource is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(resourceService.getOne(mockResource._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockResource._id);
    });
  });

  describe('updateById', () => {
    it('should update a resource by ID', async () => {
      const updateResource = {
        ...mockResource,
        name: 'Updated resource',
      } as UpdateResourceDTO;
      const resource = { name: 'Updated resource' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updateResource);

      const result = await resourceService.updateById(
        mockResource._id,
        resource as UpdateResourceDTO,
      );

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockResource._id,
        resource,
        {
          new: true,
          runValidators: true,
        },
      );

      expect(result.name).toEqual(updateResource.name);
    });
  });

  describe('delete', () => {
    it('should delete a resource by ID', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockResource);

      const result = await resourceService.delete(mockResource._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockResource._id);

      expect(result).toEqual(mockResource);
    });
  });
});
