import { Media } from "#models";
import { baseService, mediaService } from "#services";
import fs from 'fs';
export class mediaController {
  static async upload(req, res) {
    const files = await req.files();
    const responseData = await mediaService.upload(files);
    return res.status(200).send(responseData);
  }

  static async get(req, res) {
    const id = req.params.id;
    const media = await baseService.getOne(Media, id);
    if (!media) throw new Error("File not found!");

    const stream = fs.createReadStream(`./././uploads/${id}${media.extension}`);
    return res.send(stream);
  }
}
