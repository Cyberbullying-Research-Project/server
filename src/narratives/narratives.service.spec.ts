import { Test, TestingModule } from '@nestjs/testing';
import { NarrativesService } from './narratives.service';
import { Narrative } from './schemas/narrative.schema';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../auth/schemas/user.schema';
import { CreateNarrativeDTO } from './dto/createNarrative.dto';
import { UpdateNarrativeDTO } from './dto/updateNarrative.dto';
import { GetNarrativeDTO } from './dto/getNarrative.dto';

describe('NarrativesService', () => {
  let narrativeService: NarrativesService;
  let model: Model<Narrative>;

  const mockNarrativeService = {
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

  const mockNarrative = {
    _id: '61c0ccf11d7bf83d153d7c70',
    title: 'Nuevo post',
    body: 'No hay',
    created_by: mockUser._id,
    created_at: new Date(),
    updated_at: new Date(),
  } as unknown as Narrative;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NarrativesService,
        {
          provide: getModelToken(Narrative.name),
          useValue: mockNarrativeService,
        },
      ],
    }).compile();

    narrativeService = module.get<NarrativesService>(NarrativesService);
    model = module.get<Model<Narrative>>(getModelToken(Narrative.name));
  });

  describe('findAll', () => {
    it('should return an array of narratives', async () => {
      const query = { page: '1', keyword: 'test' };

      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockNarrative]),
            }),
          }) as any,
      );

      const result = await narrativeService.getAll(query);

      expect(model.find).toHaveBeenCalledWith({
        $or: [
          { title: { $regex: query.keyword, $options: 'i' } },
          { keywords: { $regex: query.keyword, $options: 'i' } },
        ],
      });

      expect(result).toEqual([mockNarrative]);
    });
  });

  describe('create', () => {
    it('should create a narrative', async () => {
      const newNarrative = {
        title: 'Nuevo post',
        body: 'No hay',
        created_by: mockUser._id,
        created_at: new Date(),
        resources: [],
      } as unknown as CreateNarrativeDTO;

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve([mockNarrative]));

      const result = await narrativeService.create(
        newNarrative as CreateNarrativeDTO,
        mockUser as User,
      );

      expect(result).toEqual([mockNarrative]);
    });
  });

  describe('findById', () => {
    it('should return a narrative', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockNarrative);

      const result = await narrativeService.getOne(mockNarrative._id);

      expect(model.findById).toHaveBeenCalledWith(mockNarrative._id);

      expect(result).toEqual(mockNarrative);
    });

    it('should throw an error if ID is invalid', async () => {
      const id = 'invalidId';
      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);
      await expect(narrativeService.getOne(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('should throw NotFoundExeption if narrative is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(narrativeService.getOne(mockNarrative._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockNarrative._id);
    });
  });

  describe('updateById', () => {
    it('should update a narrative', async () => {
      const updateNarrative = {
        ...mockNarrative,
        title: 'Updated title',
      } as UpdateNarrativeDTO;
      const resource = { title: 'Update post' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updateNarrative);

      const result = await narrativeService.updateById(
        mockNarrative._id,
        updateNarrative as UpdateNarrativeDTO,
      );

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockNarrative._id,
        updateNarrative,
        {
          new: true,
          runValidators: true,
        },
      );

      expect(result.title).toEqual(updateNarrative.title);
    });
  });

  describe('delete', () => {
    it('should delete a narrative', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockNarrative);

      const result = await narrativeService.delete(mockNarrative._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockNarrative._id);

      expect(result).toEqual(mockNarrative);
    });
  });
});
