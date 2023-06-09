import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

const PREFIX = `./public/uploads`;

export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    callback(new BadRequestException('Only image files are allowed'), false);
  } else {
    callback(null, true);
  }
};

export const localOptionsUserAvatar: MulterOptions = {
  storage: diskStorage({
    destination: `${PREFIX}/user`,
    filename: (req, file, cb) => {
      const extension: string = file.originalname.split('.').pop();
      const fileName = `${uuid()}.${extension}`;

      cb(null, fileName);
    },
  }),
  fileFilter: imageFileFilter,
};
