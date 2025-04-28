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
                    if (!req.user) {
                        return cb(new Error('User not authenticated'), '');
                    }
                    const userName = req.user.username;
                    const ext = file.originalname.split('.').pop();
                    const filename = `${file.fieldname}-${userName}.${ext}`;
                    cb(null, filename);
                }
            }),
        };
    }
}
