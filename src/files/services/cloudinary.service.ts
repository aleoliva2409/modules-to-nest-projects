import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

import { ImageUploadedResponse, MulterFile } from '../types';
import { DeleteImageDto } from '../dto';
import { errorManager } from 'src/shared/utils';

@Injectable()
export class CloudinaryService {
  private readonly uploadPreset: string;

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: configService.getOrThrow('CLOUDINARY_API_SECRET'),
    });

    this.uploadPreset = configService.getOrThrow('CLOUDINARY_UPLOAD_PRESET');
  }

  async uploadImage(image: MulterFile): Promise<ImageUploadedResponse> {
    try {
      const buffer = image.buffer;
      const mimetype = image.mimetype;
      const base64 = Buffer.from(buffer).toString('base64');

      const imageBase64 = `data:${mimetype};base64,${base64}`;

      const { public_id, secure_url }: UploadApiResponse = await cloudinary.uploader.upload(
        imageBase64,
        {
          // ?? preset has all configs
          upload_preset: this.uploadPreset,
          // ?? transformation configured in Cloudinary platform
          // transformation: [{ quality: 'auto:best' }, { fetch_format: 'webp' }],
        },
      );

      return {
        url: secure_url,
        hostId: public_id,
      };
    } catch (error) {
      errorManager(error);
    }
  }

  async deleteImage(deleteImageDto: DeleteImageDto) {
    try {
      const { hostId } = deleteImageDto;

      const resp = await cloudinary.uploader.destroy(hostId);

      return resp;
    } catch (error) {
      errorManager(error);
    }
  }
}
