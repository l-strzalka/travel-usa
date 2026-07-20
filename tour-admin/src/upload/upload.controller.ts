import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname, join } from 'path';


// Zakładamy, że Twój Guard nazywa się JwtAuthGuard lub AdminGuard (zabezpieczamy sesję admina)
import { AdminGuard } from '../auth/guards/admin.guards';

@Controller('upload')
// @UseGuards(AdminGuard) // Odkomentuj, gdy chcesz, aby tylko Admin mógł uploadować pliki
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // Pliki trafią do folderu "uploads" w głównym katalogu tour-admin
        destination: (req, file, callback) => {
          const uploadPath = join(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/)) {
          return callback(
            new BadRequestException(
              'Niedozwolony format pliku! Wybierz obraz (jpg, png, webp, gif).',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // Limit rozmiaru pliku: 5MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Brak przesłanego pliku');
    }

    const apiBaseUrl =
      process.env.API_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');
    const fileUrl = `${apiBaseUrl}/uploads/${file.filename}`;
    return {
      url: fileUrl,
      originalName: file.originalname,
      size: file.size,
    };
  }
}
