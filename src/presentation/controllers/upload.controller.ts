import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../../common/security/guards/jwt-auth.guard';
import { UPLOAD_ROUTES } from '../../app.routes';
import { existsSync, mkdirSync } from 'fs';

// Ensure upload directory exists
const uploadDir = join(process.cwd(), 'uploads', 'profiles');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

// File filter to validate image types
const imageFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.startsWith('image/')) {
    return callback(
      new BadRequestException('Only image files are allowed'),
      false,
    );
  }
  callback(null, true);
};

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller(UPLOAD_ROUTES.ROOT)
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post(UPLOAD_ROUTES.PROFILE_PHOTO)
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  uploadProfilePhoto(@UploadedFile() file: Express.Multer.File): {
    url: string;
    filename: string;
  } {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const url = `/uploads/profiles/${file.filename}`;

    return {
      url,
      filename: file.filename,
    };
  }
}
