import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import * as multer from 'multer';
@Injectable()
export class MulterConfig implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: multer.diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    const ext = file.originalname.split('.').pop();
                    const filename = `${file.fieldname}-${uniqueSuffix}.${ext}`;
                    cb(null, filename);
                }
            }),
        };
    }
}
