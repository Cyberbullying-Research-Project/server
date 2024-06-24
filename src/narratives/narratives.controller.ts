import { Controller, Get, Param, Post, Body, Put, Delete, Query, UseGuards, Req, Patch } from '@nestjs/common';
import {Query as ExpressQuery} from 'express-serve-static-core';
import { NarrativesService } from './narratives.service';
import { GetNarrativeDTO } from './dto/getNarrative.dto';
import { MongoIdPipe } from './narratives.pipe';
import { AuthGuard } from '@nestjs/passport';
import { UpdateNarrativeDTO } from './dto/updateNarrative.dto';

@Controller('narratives')
export class NarrativesController {
    constructor(private narrativesService: NarrativesService){}

    @Get()    
    async getAll(@Query() query: ExpressQuery):Promise<GetNarrativeDTO[]>{
        const narrative = await this.narrativesService.getAll(query);

        const response: GetNarrativeDTO[] = narrative.map(narrative => ({
            _id: narrative._id,
            title: narrative.title,
            body: narrative.body,
            created_by: narrative.created_by,
            created_at: narrative.created_at,
            updated_at: narrative.updated_at,
            resources: narrative.resources
        }));

        return response;
    }

    @Get(':id')
    async getOne(@Param('id', MongoIdPipe) id: string ): Promise<GetNarrativeDTO> {
        const narrative = await this.narrativesService.getOne(id);

        const response: GetNarrativeDTO = {
            _id: narrative._id,
            title: narrative.title,
            body: narrative.body,
            created_by: narrative.created_by,
            created_at: narrative.created_at,
            updated_at: narrative.updated_at,
            resources: narrative.resources
        }

        return response;
    }

    @Post()
    @UseGuards(AuthGuard())
    async create(@Body() newNarrative: GetNarrativeDTO, @Req() req): Promise<GetNarrativeDTO>{
        const narrative = await this.narrativesService.create(newNarrative, req.user);

        const response: GetNarrativeDTO = {
            _id: narrative._id,
            title: narrative.title,
            body: narrative.body,
            created_by: narrative.created_by,
            created_at: narrative.created_at,
            updated_at: narrative.updated_at,
            resources: narrative.resources
        }

        return response;
    }    

    @Patch(':id')
    @UseGuards(AuthGuard())
    async update(@Param('id', MongoIdPipe) id: string, @Body() updateNarrative: UpdateNarrativeDTO): Promise<GetNarrativeDTO>{
        const narrative = await this.narrativesService.updateById(id, updateNarrative);

        const response: GetNarrativeDTO = {
            _id: narrative._id,
            title: narrative.title,
            body: narrative.body,
            created_by: narrative.created_by,
            created_at: narrative.created_at,
            updated_at: narrative.updated_at,
            resources: narrative.resources
        }

        return response;
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updatePut(@Param('id', MongoIdPipe) id: string, @Body() updateNarrative: UpdateNarrativeDTO): Promise<GetNarrativeDTO>{
        const narrative = await this.narrativesService.updateById(id, updateNarrative);

        const response: GetNarrativeDTO = {
            _id: narrative._id,
            title: narrative.title,
            body: narrative.body,
            created_by: narrative.created_by,
            created_at: narrative.created_at,
            updated_at: narrative.updated_at,
            resources: narrative.resources
        }

        return response;
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    delete(@Param('id', MongoIdPipe) id: string){
        return this.narrativesService.delete(id);
    }

}
