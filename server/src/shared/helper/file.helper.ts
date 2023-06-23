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

export const fileFilter = (req: any, file: any, callback: any) => {
  // Lấy phần mở rộng của tệp tin
  const fileExt = file.originalname;
  // Kiểm tra nếu là tệp tin định dạng hình ảnh
  if (fileExt.match(/\.(jpg|jpeg|png|gif)$/)) {
    callback(null, true);
  }
  // Kiểm tra nếu là tệp tin định dạng docx hoặc excel hoặc pdf
  else if (fileExt.match(/\.(docx|xlsx|pdf)$/)) {
    callback(null, true);
  }
  // Kiểm tra nếu là tệp tin định dạng video
  else if (fileExt.match(/\.(mp4|mov|avi)$/)) {
    callback(null, true);
  }
  // Nếu không phải định dạng nào trên thì báo lỗi
  else {
    callback(new BadRequestException('Only image, docx, excel, pdf, and video files are allowed'), false);
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

export const localOptionsConversationAvatar: MulterOptions = {
  storage: diskStorage({
    destination: `${PREFIX}/conversation`,
    filename: (req, file, cb) => {
      const extension: string = file.originalname.split('.').pop();
      const fileName = `${uuid()}.${extension}`;

      cb(null, fileName);
    },
  }),
  fileFilter: imageFileFilter,
};

export const localOptionsMessageFiles: MulterOptions = {
  storage: diskStorage({
    destination: `${PREFIX}/message`,
    filename: (req, file, cb) => {
      const extension: string = file.originalname.split('.').pop();
      const fileName = `${uuid()}.${extension}`;

      cb(null, fileName);
    },
  }),
  fileFilter: fileFilter,
};