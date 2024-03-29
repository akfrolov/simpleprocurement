import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { PartnersModule } from './partners/partners.module';
import { GoodsModule } from './goods/goods.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'), // Loaded from .ENV
      }),
    }),
    // MongooseModule.forRoot(
    //   'mongodb://procurement:example@localhost:27017/procurement?authSource=admin',
    // ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        // true for serving client in production
        index: 'index.html',
        // index: false,
      },
    }),
    AuthModule,
    UsersModule,
    RequestsModule,
    PartnersModule,
    GoodsModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
