import { Controller, Get, Param, Post, Body, Put, Delete, Query, UseGuards, Req, Patch} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/createPost.dto';
import { UpdatePostDTO } from './dto/updatePost.dto';
import { GetPostDTO } from './dto/getPost.dto';
import { MongoIdPipe } from './posts.pipe';
import {Query as ExpressQuery} from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService){}
    
    @Get()
    async getAll(@Query () query: ExpressQuery): Promise<GetPostDTO[]>{
        const resources = await this.postsService.getAll(query);

        const response: GetPostDTO[] = resources.map(resource => ({
            _id: resource._id,
            title: resource.title,
            body: resource.body,
            posted_by: resource.posted_by,
            created_at: resource.created_at,
            updated_at: resource.updated_at,
            // posibly add resources
        }));

        return response;
    }

    @Get(':id')
    async getOne(@Param('id', MongoIdPipe) id: string):Promise<GetPostDTO>{
        const resource = await this.postsService.getOne(id);

        const response: GetPostDTO = {
            _id: resource._id,
            title: resource.title,
            body: resource.body,
            posted_by: resource.posted_by,
            created_at: resource.created_at,
            updated_at: resource.updated_at,
            // posibly add resources
        }
        return response;
    }

    @Post()
    @UseGuards(AuthGuard())
    async create(@Body() newPost: CreatePostDTO, @Req() req): Promise<GetPostDTO>{
        const post = await this.postsService.create(newPost, req.user);

        const response: GetPostDTO = {
            _id: post._id,
            title: post.title,
            body: post.body,
            posted_by: post.posted_by,
            created_at: post.created_at,
            updated_at: post.updated_at,
            // posibly add resources
        }

        return response;
    }
        
    @Patch(':id')
    @UseGuards(AuthGuard())
    async update(@Param('id', MongoIdPipe) id: string, @Body() updatePost: UpdatePostDTO): Promise<GetPostDTO>{
        const resource = await this.postsService.updateById(id, updatePost);

        const response: GetPostDTO = {
            _id: resource._id,
            title: resource.title,
            body: resource.body,
            posted_by: resource.posted_by,
            created_at: resource.created_at,
            updated_at: resource.updated_at,
            // posibly add resources
        }

        return response;
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updatePut(@Param('id', MongoIdPipe) id: string, @Body() updatePost: UpdatePostDTO): Promise<GetPostDTO>{
        const resource = await this.postsService.updateById(id, updatePost);

        const response: GetPostDTO = {
            _id: resource._id,
            title: resource.title,
            body: resource.body,
            posted_by: resource.posted_by,
            created_at: resource.created_at,
            updated_at: resource.updated_at,
            // posibly add resources
        }

        return response;
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    delete(@Param('id', MongoIdPipe) id: string){
        return this.postsService.delete(id);
    }
}
