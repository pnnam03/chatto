import { ERR_MSG } from "#constants";
import { postgres } from "#db";
import { BadRequestError } from "#responses";
import { Op } from "sequelize";

export class baseService {
  static async create(model, body) {
    const record = postgres.transaction((t) => {
      const record = model.create(body);
      return record;
    });
    return record;
  }

  static async update(model, id, body) {
    const record = await this.getOne(model, id);
    if (!record) throw new BadRequestError(ERR_MSG.RECORD_NOT_FOUND);

    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        record[key] = body[key];
      }
    }

    const updatedRecord = await postgres.transaction((t) => {
      return record.save();
    });
    return updatedRecord;
  }

  static async getOne(model, id) {
    const record = await model.findOne({
      where: { id: id },
    });

    return record;
  }

  static async getList(model, limit, offset, filter, order) {
    // filter all records with key LIKE value
    // Example: "email": ".com" => return list of records with "email" fields contain ".com"
    const whereClause = {
      [Op.and]: filter
      ? Object.entries(filter).map(([key, value]) => ({
        [key]: value,
      }))
      : [],
    };

    const records = await model.findAll({
      limit,
      offset,
      where: whereClause,
      order,
    });

    return records;
  }

  static async getAll(model) {
    const records = await model.findAll();
    return records;
  }
  
  static async delete(model, id) {
    const record = await this.getOne(id);
    if (!record) throw new BadRequestError(ERR_MSG.RECORD_NOT_FOUND);
    await postgres.transaction((t) => {
      record.destroy();
    });
  }

  static async findOne(model, whereClause) {
    const record = await model.findOne({ where: whereClause });
    return record;
  }
}
