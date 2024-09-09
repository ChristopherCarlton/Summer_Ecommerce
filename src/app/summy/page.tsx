"use client";
import React, { useState } from "react";
import { supabase } from '../../lib/supabaseClient';
import EditPage from "../components/EditPage/editPage";

function UploadEditPage() {
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newLink, setNewLink] = useState("");
  const [message, setMessage] = useState<{ text: string; color: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
      console.log('Image selected:', e.target.files[0].name, e.target.files[0].size, e.target.files[0].type);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDescription(e.target.value);
    console.log('Description updated:', e.target.value);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLink(e.target.value);
    console.log('Link updated:', e.target.value);
  };

  const handleSubmit = async () => {
    if (newImage && newDescription) {
      // Generate a unique id for the item
      const id = Date.now();
      console.log('Starting the upload process...');
      console.log('Generated ID:', id);

      // Logging image details
      console.log('Image details:', {
        name: newImage.name,
        type: newImage.type,
        size: newImage.size,
      });

      // Upload image to Cloudflare R2
      try {
        const formData = new FormData();
        formData.append('file', newImage);
        formData.append('key', `summer-item-${id}.png`);
        console.log('FormData prepared:', formData);

        const response = await fetch(`/api/cloudflare/upload-image`, {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response:', response);

        if (!response.ok) {
          console.error('Upload failed with status:', response.status);
          throw new Error('Failed to upload image to Cloudflare R2');
        }

        const data = await response.json();
        console.log('Upload successful, response data:', data);

        const imageUrl = data.url;
        console.log('Image URL:', imageUrl);

        // Insert the new item into the database
        const newItem = {
          id: id,
          name: newDescription,
          link: newLink || imageUrl,
        };

        console.log('Inserting new item into the database:', newItem);

        const { data: insertData, error } = await supabase
          .from('summerItems')
          .insert([newItem]);

        if (error) {
          console.error('Database insert error:', error);
          setMessage({ text: 'Upload failed', color: 'red' });
        } else {
          console.log('Item added successfully to the database:', insertData);
          setMessage({ text: 'Upload success', color: 'green' });

          // Reset form
          setNewImage(null);
          setNewDescription("");
          setNewLink("");
          (document.getElementById("imageInput") as HTMLInputElement).value = "";
        }
      } catch (error) {
        console.error('Error occurred during the upload process:', error);
        setMessage({ text: 'Upload failed', color: 'red' });
      }
    } else {
      console.warn('Form submission attempted with missing image or description');
      setMessage({ text: 'Please provide an image and description', color: 'red' });
    }
  };

  return (
    <div className="bg-[#FFC0CB] min-h-screen p-8">
      <header className="bg-white text-[#FF69B4] p-6 shadow-md mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold font-pacifico">Upload New Item</h1>
        </div>
      </header>

      <div className="container mx-auto mb-8">
        <h2 className="text-2xl font-bold text-[#FF69B4] mb-4">Add New Item</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <input type="file" id="imageInput" onChange={handleImageChange} className="mb-4 w-full text-black" />
          <input
            type="text"
            value={newDescription}
            onChange={handleDescriptionChange}
            placeholder="Description"
            className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
          />
          <input
            type="text"
            value={newLink}
            onChange={handleLinkChange}
            placeholder="Link (optional)"
            className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
          />
          <button
            onClick={handleSubmit}
            className="bg-[#FF69B4] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FFC0CB] transition duration-300 w-full"
          >
            Add Item
          </button>
          {message && (
            <div className={`mt-4 p-4 rounded-lg text-white`} style={{ backgroundColor: message.color }}>
              {message.text}
            </div>
          )}
        </div>
      </div>
      <EditPage />
    </div>
  );
}

export default UploadEditPage;
