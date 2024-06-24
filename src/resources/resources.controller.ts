import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDTO } from './dto/createResource.dto';
import { UpdateResourceDTO } from './dto/UpdateResource.dto';
import { GetResourceDTO } from './dto/getResource.dto';
import { MongoIdPipe } from './resources.pipe';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get()
  // @UseGuards(AuthGuard()) // Uncomment this to enable authentication
  async getAll(@Query() query: ExpressQuery): Promise<GetResourceDTO[]> {
    const resources = await this.resourcesService.getAll(query);

    // Map the resources to ResourceResponseDTO
    const response: GetResourceDTO[] = resources.map((resource) => ({
      name: resource.name,
      description: resource.description,
      path: resource.path,
      type: resource.type,
      created_by: resource.created_by,
      updated_at: resource.updated_at,
    }));

    return response;
  }

  @Get(':id')
  // @UseGuards(AuthGuard()) // Uncomment this to enable authentication
  async getOne(@Param('id', MongoIdPipe) id: string): Promise<GetResourceDTO> {
    const resource = await this.resourcesService.getOne(id);

    const response: GetResourceDTO = {
      name: resource.name,
      description: resource.description,
      path: resource.path,
      type: resource.type,
      created_by: resource.created_by,
      updated_at: resource.updated_at,
    };

    return response;
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() newResource: CreateResourceDTO,
    @Req() req,
  ): Promise<GetResourceDTO> {
    const resource = await this.resourcesService.create(newResource, req.user);

    const response: GetResourceDTO = {
      name: resource.name,
      description: resource.description,
      path: resource.path,
      type: resource.type,
      created_by: resource.created_by,
      updated_at: resource.updated_at,
    };

    return response;
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateResource: UpdateResourceDTO,
  ): Promise<GetResourceDTO> {
    const resource = await this.resourcesService.updateById(id, updateResource);

    const response: GetResourceDTO = {
      name: resource.name,
      description: resource.description,
      path: resource.path,
      type: resource.type,
      created_by: resource.created_by,
      updated_at: resource.updated_at,
    };

    return response;
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updatePut(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateResource: UpdateResourceDTO,
  ): Promise<GetResourceDTO> {
    const resource = await this.resourcesService.updateById(id, updateResource);

    const response: GetResourceDTO = {
      name: resource.name,
      description: resource.description,
      path: resource.path,
      type: resource.type,
      created_by: resource.created_by,
      updated_at: resource.updated_at,
    };

    return response;
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.resourcesService.delete(id);
  }
}
