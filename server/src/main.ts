import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from "express";
// import * as session from 'express-session';
// import * as passport from "passport";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  // app.use(
  //   session({
  //     secret: 'my-secret',
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       domain: 'http://localhost',
  //       maxAge: 3600000,
  //       secure: false,
  //     }
  //   }),
  // );
  // app.use(passport.initialize())
  // app.use(passport.session())

  await app.listen(3000);
}
bootstrap();
