import multer from 'multer';

export const fileTypes = {
    image: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
};

export const uploadCloudFile = (fileValidation = []) => {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('In-valid file format'), false);
        }
    }
    return multer({ det: 'tempPath', fileFilter, storage });
};
