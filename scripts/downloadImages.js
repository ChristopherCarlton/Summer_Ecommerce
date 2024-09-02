const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from a .env file
require('dotenv').config();

// Initialize Supabase client using environment variables
// const supabaseUrl = ;
// const supabaseKey = ;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or anonymous key.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function downloadImages() {
  const bucketName = 'product-images'; // Replace with your bucket name
  const saveDirectory = 'downloads'; // The directory where images will be saved

  // Create the directory if it doesn't exist
  if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory, { recursive: true });
  }

  // List all files in the bucket
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .list('', { limit: 300 });

  if (error) {
    console.error('Error listing files:', error);
    return;
  }

  for (const file of data) {
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from(bucketName)
      .download(file.name);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      continue;
    }

    // Save the file locally
    const savePath = path.join(saveDirectory, file.name);
    fs.writeFileSync(savePath, Buffer.from(await fileData.arrayBuffer()));
    console.log(`Downloaded ${file.name} to ${savePath}`);
  }
}

downloadImages();
