import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
// import { PassportModule } from "@nestjs/passport";
// import { LocalStrategy } from "./local.strategy";
// import { SessionSerializer } from "./session.serializer";
import { AuthController } from './auth.controller';
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [
    AuthService,
    // LocalStrategy,
    // SessionSerializer
  ],
  imports: [
    // JwtModule.register({
    //   global: true,
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '60s' },
    // }),
    forwardRef( () => UsersModule ),
    // UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret:  configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '360000s',
        },
      }),
      inject: [ConfigService],
    }),
    // PassportModule.register({session: true})
  ],
  // controllers: [AuthController],
  exports: [
    AuthService,
    JwtModule
    // SessionSerializer,
    // PassportModule
  ],
  controllers: [AuthController],
})
export class AuthModule {}
