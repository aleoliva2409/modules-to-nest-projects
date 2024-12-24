import { BadRequestException } from '@nestjs/common';

import { FileFilterCB, MulterFile, Req } from '../types';

export const imageFilterInterceptor = (_req: Req, file: MulterFile, cb: FileFilterCB) => {
  if (!file) return cb(new BadRequestException('Image file is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'png', 'gif', 'jpeg'];

  if (!validExtensions.includes(fileExtension))
    return cb(new BadRequestException('Image file extension is not allowed'), false);
  cb(null, true);
};
