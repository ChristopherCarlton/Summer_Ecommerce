import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { promisify } from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Define the interface inline
interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File;
}

// Configure multer for file handling
const upload = multer({
  storage: multer.memoryStorage(),
});

const uploadMiddleware = promisify(upload.single('file'));

// Configure AWS S3 client for Cloudflare R2 (using AWS SDK v3)
const s3Client = new S3Client({
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || '',
  region: 'auto',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === 'POST') {
    try {
      // Handle file upload
      await uploadMiddleware(req as any, res as any);

      const reqWithFile = req as MulterRequest;
      const file = reqWithFile.file;
      const key = reqWithFile.body.key;

      if (!file) {
        console.error('File is missing');
        return res.status(400).json({ message: 'Missing file' });
      }
      
      if (!key) {
        console.error('Key is missing');
        return res.status(400).json({ message: 'Missing key' });
      }

      // Upload file to Cloudflare R2 (using AWS SDK v3)
      const uploadParams = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || '',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(uploadParams);
      const uploadResult = await s3Client.send(command);

      const imageUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

      res.status(200).json({ url: imageUrl });
    } catch (error) {
      console.error('Error uploading file:', error);

      if (error instanceof Error) {
        res.status(500).json({ message: 'File upload failed', error: error.message });
      } else {
        res.status(500).json({ message: 'File upload failed' });
      }
    }
  } else {
    console.warn('Invalid request method:', req.method);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle multipart/form-data
  },
};
