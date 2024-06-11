import { postgres } from '#db';
import { Media } from '#models';
import fs from 'fs';
import path from "path";
import { pipeline } from "stream";
import util from 'util';

const pump = util.promisify(pipeline);

export class mediaService {
  static async upload(files) {
    const response = [];
    for await (const file of files) {
      if (file.file) {
        const extension = path.extname(file.filename);
        const mediaRecord = await this.create(file.filename, file.fieldname, extension);
        const savePath = `./././uploads/${mediaRecord.id}${extension}`;
        await pump(file.file, fs.createWriteStream(savePath));

        response.push(mediaRecord);
      }
    }
    if (response.length === 1)
      return response[0];
    return response;
  }
  
  static async create(fileName, type, extension) {
    const record = postgres.transaction( (t) => {
      return Media.create({fileName, type, extension});
    });
    return record;
  }
}