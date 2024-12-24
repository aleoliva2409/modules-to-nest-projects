export type Req = Express.Request;
export type MulterFile = Express.Multer.File;
export type FileFilterCB = (error: Error, acceptFile: boolean) => void;
export type FileNamerCB = (error: Error, filename: string) => void;

export interface ImageUploadedResponse {
  url: string;
  hostId: string;
}
