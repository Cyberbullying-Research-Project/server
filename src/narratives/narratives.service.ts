import { BadRequestException, Injectable,  NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Narrative } from './schemas/narrative.schema';
import { GetNarrativeDTO } from './dto/getNarrative.dto';
import { CreateNarrativeDTO } from './dto/createNarrative.dto';
import { UpdateNarrativeDTO } from './dto/updateNarrative.dto';
import mongoose, { Model } from 'mongoose';
import {Query} from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class NarrativesService {
    constructor(
        @InjectModel(Narrative.name)
        private narrativeModel: Model<Narrative>
    ){}

    async getAll(query:Query): Promise<GetNarrativeDTO[]>{
        const resPerPage = 10; // results per page
        const currentPage = Number(query.page) || 1; // Page
        const skip = resPerPage * (currentPage - 1); // Skips

        const  keyword = query.keyword ? {
            $or: [
                { title: { $regex: query.keyword, $options: 'i' } },                
                { keywords: { $regex: query.keyword, $options: 'i' } }
            ]
        } : {}

        const response = await this.narrativeModel.find({ ...keyword }).limit(resPerPage).skip(skip);

        const narratives: GetNarrativeDTO[] = response.map(narrative => ({
            _id: narrative._id,
            title: narrative.title,
            body: narrative.body,
            created_by: narrative.created_by,
            created_at: narrative.created_at,
            updated_at: narrative.updated_at,
            resources: narrative.resources
        }));

        return narratives;
    }

    async getOne(id: string): Promise<GetNarrativeDTO> {
        const isValidId = mongoose.isValidObjectId(id);

        if(!isValidId){
            throw new BadRequestException(`Invalid ID ${id}`);
        }

        const narrative = await this.narrativeModel.findById(id);

        if(!narrative){
            throw new NotFoundException(`Post ${id} not found`)
        }

        return narrative;
    }

    create(newNarrative: CreateNarrativeDTO, user:User):Promise<GetNarrativeDTO> {
        const data = Object.assign(newNarrative, {created_by: user._id})
        const narrative  = this.narrativeModel.create(data);
        return narrative;
    }

    async updateById(id: string, updateNarrative: UpdateNarrativeDTO ): Promise<GetNarrativeDTO>{
        const narrative = await this.narrativeModel.findByIdAndUpdate(id, updateNarrative, {new: true, runValidators: true});
        return narrative;
    }

    delete(id: string):Promise<GetNarrativeDTO>{
        const narrative = this.narrativeModel.findByIdAndDelete(id);
        return narrative;
    }
}
