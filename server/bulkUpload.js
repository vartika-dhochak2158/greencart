import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// 1. Configure Cloudinary credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'e4nkrgxd',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Target your client assets folder
const assetsPath = path.resolve('../client/src/assets');

async function uploadAllAssets() {
    try {
        if (!fs.existsSync(assetsPath)) {
            console.error(`Assets directory not found at: ${assetsPath}`);
            return;
        }

        // Filter for valid image formats
        const files = fs.readdirSync(assetsPath);
        const imageFiles = files.filter((file) =>
            /\.(png|jpe?g|webp|svg)$/i.test(file)
        );

        console.log(`Found ${imageFiles.length} images to upload.\nStarting upload...`);

        let count = 0;
        for (const file of imageFiles) {
            const fullPath = path.join(assetsPath, file);

            // Preserve the exact filename without the extension as the public_id
            const filenameWithoutExt = path.parse(file).name;

            const uploadResult = await cloudinary.uploader.upload(fullPath, {
                public_id: filenameWithoutExt,
                resource_type: 'image',
                overwrite: true,
            });

            count++;
            console.log(`[${count}/${imageFiles.length}] Uploaded: ${file} -> ${uploadResult.secure_url}`);
        }

        console.log(`\n🎉 All ${count} images uploaded to Cloudinary successfully!`);
    } catch (error) {
        console.error('Error during bulk upload:', error);
    }
}

uploadAllAssets();