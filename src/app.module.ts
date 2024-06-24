import { Module } from '@nestjs/common';

import { NarrativesModule } from './narratives/narratives.module';
import { PostsModule } from './posts/posts.module';
import { ResourcesModule } from './resources/resources.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// AWS S3
import { AwsConfigService } from './config/aws.config';
import { S3Service } from './services/s3.service';

// Websocket socket-io
import { ChatGateway } from './socket-io/chat.gateway';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    MongooseModule.forRoot(process.env.DB_URI),    
    NarrativesModule, 
    PostsModule, 
    ResourcesModule,    
    AuthModule,    
  ],
  controllers: [],  
  providers: [AwsConfigService, S3Service, ChatGateway],
})
export class AppModule {}
