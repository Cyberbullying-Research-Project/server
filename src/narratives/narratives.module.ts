import { Module } from '@nestjs/common';
import { NarrativesController } from './narratives.controller';
import { NarrativesService } from './narratives.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NarrativeSchema } from './schemas/narrative.schema'

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Narrative', schema: NarrativeSchema }])
  ], 
  controllers: [NarrativesController],
  providers: [NarrativesService]
})
export class NarrativesModule {}
