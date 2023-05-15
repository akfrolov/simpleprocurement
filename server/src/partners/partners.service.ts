import { Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Partner } from "./partners.schema";
import { sorting } from "../common/utils/sorting";

@Injectable()
export class PartnersService {
  constructor(@InjectModel(Partner.name) private partnerModel: Model<Partner>) {}
  async create(createPartnerDto: CreatePartnerDto) {
    const createdPartner = new this.partnerModel(createPartnerDto);
    const doc = await createdPartner.save();
    return doc.toObject();
  }

  async getList(sort, range, filter) {
    const srt = sorting(sort[1])
    let search: string;
    if (!!filter.q) {
      search = filter.q;
      delete filter.q;
    }
    let items = this.partnerModel
      .find(filter,
        // '-_id -_identifier -__v',
        null,
        { skip: range[0], limit: range[1] }
      )
      .sort({ [sort[0]]: srt })
    if (search) {
      try {
        items = items.or([
          { title: new RegExp(search) },
          { ref: new RegExp(search) },
          { contacts: new RegExp(search) }
        ]);
      } catch (e) {
        console.log(e)
      }
    }
    // if (items.length === 0) return null;
    return {
      data: await items.exec(),
      total: await this.partnerModel.count(),
    }
  }

  async getOne(id: string) {
    return await this.partnerModel.findById(id).exec();
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    return await this.partnerModel.findByIdAndUpdate(id, updatePartnerDto).exec();
  }

  async delete(id: string) {
    return await this.partnerModel.findByIdAndDelete(id).exec();
  }

  async updateMany(ids: string[], updatePartnerDto: UpdatePartnerDto) {
    await this.partnerModel.updateMany(
      { _id: { $in: ids } },
      updatePartnerDto,
    ).exec();
    return ids;
  }

  async deleteMany(ids: string[]) {
    await this.partnerModel.deleteMany(
      { _id: { $in: ids } },
    ).exec();
    return ids;
  }

  async getMany(ids: string[]) {
    return await this.partnerModel.find({ _id: { $in: ids } }).exec();
  }
}
