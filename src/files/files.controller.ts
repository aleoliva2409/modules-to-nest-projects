import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CloudinaryService } from './services';
import { DeleteImageDto } from './dto';
import { FILE_IMAGE } from './constants';
import { imageFilterInterceptor } from './interceptors';
import { MulterFile } from './types';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: CloudinaryService) {}

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor(FILE_IMAGE, { fileFilter: imageFilterInterceptor }))
  @Post('images/upload')
  create(@UploadedFile() file: MulterFile) {
    return this.filesService.uploadImage(file);
  }

  @HttpCode(HttpStatus.OK)
  @Post('images/delete')
  remove(@Body() deleteImageDto: DeleteImageDto) {
    return this.filesService.deleteImage(deleteImageDto);
  }
}
