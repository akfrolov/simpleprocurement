import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./users.schema";
import { sorting } from "../common/utils/sorting";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel(createUserDto);
    const doc = await createdUser.save();
    return doc.toObject();
  }

  async getList(sort, range, filter) {
    const srt = sorting(sort[1])
    let search: string;
    if (!!filter.q) {
      search = filter.q;
      delete filter.q;
    }
    let items = this.userModel
      .find(filter,
        '-password',
        // null,
        { skip: range[0], limit: range[1] }
      )
      .sort({ [sort[0]]: srt })
    if (search) {
      try {
        items = items.or([
          { name: new RegExp(search) },
          { email: new RegExp(search) },
          { role: new RegExp(search) }
        ]);
      } catch (e) {
        console.log(e)
      }
    }
    // if (items.length === 0) return null;
    return {
      data: await items.exec(),
      total: await this.userModel.count(),
    }
  }

  async getOne(id: string) {
    return await this.userModel.findById(id, '-password').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      projection: '-password',
    }).exec();
  }

  async delete(id: string) {
    return await this.userModel.findByIdAndDelete(id,
      {projection: '-password'}
    ).exec();
  }

  async updateMany(ids: string[], updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) delete updateUserDto.password;
    await this.userModel.updateMany(
      { _id: { $in: ids } },
      updateUserDto,
    ).exec();
    return ids;
  }

  async deleteMany(ids: string[]) {
    await this.userModel.deleteMany(
      { _id: { $in: ids } },
    ).exec();
    return ids;
  }

  async getMany(ids: string[]) {
    return await this.userModel.find({ _id: { $in: ids } }, '-password').exec();
  }

  async getByEmail(email: string) {
    return await this.userModel.findOne({email: email}).exec();
  }
}
