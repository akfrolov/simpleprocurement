import { Injectable } from '@nestjs/common';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Good, GoodDocument } from './goods.schema';
import { Model } from 'mongoose';
import { sorting } from '../common/utils/sorting';
import * as fs from 'fs';

function saveImage(
  data: { src: string; title: string; _id?: string },
  goodId: string,
) {
  // const extRegex = /\/(.*);/;
  // const imageExt = image.match(extRegex)[1];
  // const img = `${index}.${imageExt}`;
  if (data._id) return data;
  fs.writeFile(
    `./public/images/${goodId}/${data.title}`,
    data.src.split(',')[1],
    { encoding: 'base64' },
    (error) => {
      if (error) {
        console.log('Error');
      } else {
        console.log('File Created');
      }
    },
  );
  return {
    src: `${process.env.ROOT_URL}/images/${goodId}/${data.title}`,
    title: data.title,
  };
}

function deleteImages(good: GoodDocument) {
  fs.rmdir(`./public/images/${good.id}`, (err) => {
    if (err) {
      console.log(err);
    }

    console.log(`./public/images/${good.id} is deleted!`);
  });
  // const file = good.image.split("/")[4];
  // const dir = `./public/images/${file}`;
  // fs.unlink(dir,
  //   (error) => {
  //     if (error) {
  //       console.log("Error");
  //     } else {
  //       console.log("File Deleted");
  //     }
  //   });
}

@Injectable()
export class GoodsService {
  constructor(
    @InjectModel(Good.name) private goodModel: Model<Good>, // @InjectModel(Request.name) private requestModel: Model<Request>,
  ) {}

  async create(createGoodDto: CreateGoodDto) {
    let images: { src: string; title: string }[];
    if (createGoodDto.images && createGoodDto.images.length > 0) {
      images = [...createGoodDto.images];
      delete createGoodDto.images;
    }

    // const initiator = await this.requestModel
    //   .findById(createGoodDto.request)
    //   .exec();

    const createdGood = new this.goodModel(createGoodDto);
    let doc = await createdGood.save();

    await fs.mkdirSync(`./public/images/${doc.id}`);

    if (images) {
      const imageLinks = images.map((data) => saveImage(data, doc.id));
      doc = await this.goodModel
        .findByIdAndUpdate(doc.id, { images: imageLinks })
        .exec();
    }
    return doc.toObject();
  }

  async getList(sort, range, filter) {
    const srt = sorting(sort[1]);

    let search: string;
    if (!!filter.q) {
      search = filter.q;
      delete filter.q;
    }

    let items;

    let initiator;
    if (!!filter.initiator) {
      initiator = filter.initiator;
      delete filter.initiator;
    }

    items = this.goodModel
      .find(
        filter,
        // '-_id -_identifier -__v',
        null,
        { skip: range[0], limit: range[1] },
      )
      .sort({ [sort[0]]: srt });

    if (search) {
      try {
        items = items.or([
          { title: new RegExp(search) },
          { notes: new RegExp(search) },
          { units: new RegExp(search) },
        ]);
      } catch (e) {
        console.log(e);
      }
    }

    if (initiator) {
      items = items.populate('request', 'initiator _id');
    }

    let listItems = await items.exec();

    if (initiator)
      listItems = listItems
        .filter(function (good) {
          return good.request.initiator.toHexString() == initiator; // return only users with email matching 'type: "Gmail"' query
          good.request = good.request._id;
        })
        .map((good) => {
          good.request = good.request._id;
          return good;
        });

    // if (items.length === 0) return null;
    return {
      data: listItems,
      total: await this.goodModel.count(),
    };
  }

  async getOne(id: string) {
    return await this.goodModel.findById(id).exec();
  }

  async update(id: string, updateGoodDto: UpdateGoodDto) {
    if (updateGoodDto.images && updateGoodDto.images.length > 0) {
      updateGoodDto.images = updateGoodDto.images.map((data) =>
        saveImage(data, id),
      );
    }

    // const initiator = await this.requestModel
    //   .findById(updateGoodDto.request)
    //   .exec();
    return await this.goodModel.findByIdAndUpdate(id, updateGoodDto).exec();
  }

  async delete(id: string) {
    const good = await this.goodModel.findByIdAndDelete(id).exec();
    deleteImages(good);
    return good;
  }

  async updateMany(ids: string[], updateGoodDto: UpdateGoodDto) {
    if (updateGoodDto.images) {
      delete updateGoodDto.images;
    }

    // const initiator = await this.requestModel
    //   .findById(updateGoodDto.request)
    //   .exec();

    await this.goodModel
      .updateMany({ _id: { $in: ids } }, updateGoodDto)
      .exec();
    return ids;
  }

  async deleteMany(ids: string[]) {
    ids.map(async (id) => {
      const good = await this.goodModel
        .findByIdAndDelete(
          id,
          // { _id: { $in: ids } }
        )
        .exec();
      deleteImages(good);
    });
    return ids;
  }

  async getMany(ids: string[]) {
    return await this.goodModel.find({ _id: { $in: ids } }).exec();
  }
}
