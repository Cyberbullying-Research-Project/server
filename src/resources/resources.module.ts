import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourceSchema } from './schemas/resource.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Resource', schema: ResourceSchema }])
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService]
})
export class ResourcesModule {}
