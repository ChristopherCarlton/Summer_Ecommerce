import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { key } = req.body;

    // Cloudflare R2 delete logic here
    // You can use the AWS SDK for this as Cloudflare R2 is S3-compatible

    res.status(200).json({ message: 'Image deleted successfully' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
