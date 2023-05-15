import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    // @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getByEmail(email);
    if (
      await bcrypt.compare(pass, user.password)
      // user.password === pass
    ) {
      const payload = {
        sub: user.id,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
        role: user.role,
        name: user.name,
        id: user.id,
      };
    }
    throw new UnauthorizedException();
  }

}
