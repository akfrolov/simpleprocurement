import { Controller, } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return req.user;
  // }

  // @UseGuards(AuthenticatedGuard)
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
