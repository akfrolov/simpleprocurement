import { Injectable } from "@nestjs/common";
import { CreateRequestDto } from "./dto/create-request.dto";
import { UpdateRequestDto } from "./dto/update-request.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Request } from "./requests.schema";
import { sorting } from "../common/utils/sorting";
import { ObjectId } from "mongoose";

@Injectable()
export class RequestsService {
  constructor(@InjectModel(Request.name) private requestModel: Model<Request>) {
  }

  async create(createRequestDto: CreateRequestDto) {
    const createdRequest = new this.requestModel(createRequestDto);
    const doc = await createdRequest.save();
    return doc.toObject();
  }

  async getList(sort, range, filter) {
    let search: string;
    if (!!filter?.q) {
      search = filter.q;
      delete filter.q;
    }

    if (!filter) filter = {};

    let items = this.requestModel.find()
      .find(filter,
        // '-_id -_identifier -__v',
        // null,
        // { skip: range[0], limit: range[1] }
      )

    if (range?.length === 2) {
      items = items.skip(range[0]).limit(range[1]);
    }

    if (sort?.length === 2) {
      const srt = sorting(sort[1])
      items = items.sort({ [sort[0]]: srt })
    }

    if (search) {
      try {
        items = items.or([
          { project: new RegExp(search) },
          { title: new RegExp(search) },
          { shortDescription: new RegExp(search) }
        ]);
      } catch (e) {
        console.log(e)
      }
    }
    const result = await items.exec();
    // if (items.length === 0) return null;
    const res = {
      data: result,
      total: await this.requestModel.count(),
    }
    return res;
  }

  async getOne(id: string) {
    return await this.requestModel.findById(id).exec();
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    return await this.requestModel.findByIdAndUpdate(id, updateRequestDto).exec();
  }

  async delete(id: string) {
    return await this.requestModel.findByIdAndDelete(id).exec();
  }

  async updateMany(ids: string[], updateRequestDto: UpdateRequestDto) {
    await this.requestModel.updateMany(
      { _id: { $in: ids } },
      updateRequestDto,
    ).exec();
    return ids;
  }

  async deleteMany(ids: string[]) {
    await this.requestModel.deleteMany(
      { _id: { $in: ids } },
    ).exec();
    return ids;
  }

  async getMany(ids: string[]) {
    return await this.requestModel.find({ _id: { $in: ids } }).exec();
  }
}
