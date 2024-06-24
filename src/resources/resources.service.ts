import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Resource } from './schemas/resource.schema';
import { CreateResourceDTO } from './dto/createResource.dto';
import { UpdateResourceDTO } from './dto/updateResource.dto';
import mongoose, { Model } from 'mongoose';
import {Query} from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';


@Injectable()
export class ResourcesService {
    constructor(
        @InjectModel(Resource.name) 
        private resourceModel: Model<Resource>
    ){}

    async getAll(query:Query): Promise<Resource[]>{
        const resPerPage = 10; // results per page
        const currentPage = Number(query.page) || 1; // Page
        const skip = resPerPage * (currentPage - 1); // Skips

        const  keyword = query.keyword ? {
            $or: [
                { name: { $regex: query.keyword, $options: 'i' } },
                { description: { $regex: query.keyword, $options: 'i' } },
                { keywords: { $regex: query.keyword, $options: 'i' } }
            ]
        } : {}

        const resources = await this.resourceModel.find({ ...keyword }).limit(resPerPage).skip(skip);
        return resources;
    }

    
    async getOne(id: string): Promise <Resource>{        
        const isValidId = mongoose.isValidObjectId(id);

        if(!isValidId){
            throw new BadRequestException(`Invalid ID ${id}`);
        }

        const resource = await this.resourceModel.findById(id);

        if(!resource){
            throw new NotFoundException(`Resource ${id} not found`)
        }
        return resource;
    } 
    
    async create(newResouse: CreateResourceDTO, user: User): Promise<Resource>{        
        const data = Object.assign(newResouse, {created_by: user._id})
        const resource = await this.resourceModel.create(data);
        return resource;
    }

    async updateById(id: string, updateResource: UpdateResourceDTO): Promise<Resource>{

        const resource = await this.resourceModel.findByIdAndUpdate(id, updateResource, {new: true, runValidators: true});
        return resource;
    }

    async delete(id: string):Promise<Resource>{
        const resource = await this.resourceModel.findByIdAndDelete(id);
        return resource;        
    }
}
