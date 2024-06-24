import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { GetPostDTO } from './dto/getPost.dto';
import { CreatePostDTO } from './dto/createPost.dto';
import { UpdatePostDTO } from './dto/updatePost.dto';
import mongoose, { Model } from 'mongoose';
import {Query} from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private postModel: Model<Post>
    ){}

    async getAll(query:Query): Promise<GetPostDTO[]>{
        const resPerPage = 10; // results per page
        const currentPage = Number(query.page) || 1; // Page
        const skip = resPerPage * (currentPage - 1); // Skips

        const  keyword = query.keyword ? {
            $or: [
                { title: { $regex: query.keyword, $options: 'i' } },                
                { keywords: { $regex: query.keyword, $options: 'i' } }
            ]
        } : {}

        const response = await this.postModel.find({ ...keyword }).limit(resPerPage).skip(skip);

        const posts: GetPostDTO[] = response.map(post => ({
            _id: post._id,
            title: post.title,
            body: post.body,
            posted_by: post.posted_by,
            created_at: post.created_at,
            updated_at: post.updated_at,
        }));

        return posts;
    }

    async getOne(id: string): Promise<GetPostDTO>{
        const isValidId = mongoose.isValidObjectId(id);

        if(!isValidId){
            throw new BadRequestException(`Invalid ID ${id}`);
        }

        const post = await this.postModel.findById(id);

        if(!post){
            throw new NotFoundException(`Post ${id} not found`)
        }

        return post;
    }

    async create(newPost: CreatePostDTO, user:User): Promise<GetPostDTO>{
        const data = Object.assign(newPost, { created_by: user._id })
        const post = await this.postModel.create(data);
        return post;
    }

    async updateById(id: string, updatePost: UpdatePostDTO): Promise<GetPostDTO>{        
        const post = await this.postModel.findByIdAndUpdate(id, updatePost, {new: true, runValidators: true});
        return post;
    }
        
    async delete(id: string):Promise<GetPostDTO>{
        const post = await this.postModel.findByIdAndDelete(id);
        return post;
    }
}
