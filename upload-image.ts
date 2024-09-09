import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { S3 } from 'aws-sdk';
import { promisify } from 'util';

// Define the interface inline
interface MulterRequest extends NextApiRequest {
  file: Express.Multer.File;
}

// Configure multer for file handling
const upload = multer({
  storage: multer.memoryStorage(),
});

const uploadMiddleware = promisify(upload.single('file'));

// Configure AWS S3 client for Cloudflare R2
const s3 = new S3({
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || '',
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  region: 'auto',
  signatureVersion: 'v4',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Bypass TypeScript checking by casting req and res to any
      await uploadMiddleware(req as any, res as any);

      const reqWithFile = req as MulterRequest; // Cast to MulterRequest
      const file = reqWithFile.file;
      const key = reqWithFile.body.key;

      if (!file || !key) {
        return res.status(400).json({ message: 'Missing file or key' });
      }

      // Upload file to Cloudflare R2
      const params = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || '', // Ensure it's a string
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();

      const imageUrl = uploadResult.Location;

      res.status(200).json({ url: imageUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'File upload failed' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle multipart/form-data
  },
};
