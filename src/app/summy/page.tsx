"use client";
import React, { useState } from "react";
import { supabase } from '../../lib/supabaseClient';

function UploadEditPage() {
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newLink, setNewLink] = useState("");
  const [message, setMessage] = useState<{ text: string; color: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDescription(e.target.value);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLink(e.target.value);
  };

  const handleSubmit = async () => {
    if (newImage && newDescription) {
      // Generate a unique id for the item
      const id = Date.now();

      console.log('Uploading image to Supabase storage...');
      console.log('Image file:', newImage);
      console.log('Image file type:', newImage.type);
      console.log('Image file size:', newImage.size);

      // Upload image to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('product-images')
        .upload(`summer-item-${id}.png`, newImage, {
          cacheControl: '3600',
          upsert: false,
        });

      if (storageError) {
        console.error('Failed to upload image:', storageError);
        setMessage({ text: 'Upload failed', color: 'red' });
        return;
      }

      console.log('Image uploaded successfully:', storageData);

      // Get the public URL of the uploaded image
      const { publicUrl: imageUrl } = supabase.storage
        .from('product-images')
        .getPublicUrl(`summer-item-${id}`).data;

      console.log('Public URL of uploaded image:', imageUrl);

      // Insert the new item into the database
      const newItem = {
        id: id,
        name: newDescription,
        link: newLink || imageUrl,
      };

      const { data, error } = await supabase
        .from('summerItems')
        .insert([newItem]);

      if (error) {
        console.error('Failed to add item:', error);
        setMessage({ text: 'Upload failed', color: 'red' });
      } else {
        console.log('Item added successfully:', data);
        setMessage({ text: 'Upload success', color: 'green' });
        setNewImage(null);
        setNewDescription("");
        setNewLink("");
        (document.getElementById("imageInput") as HTMLInputElement).value = "";
      }
    } else {
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
    </div>
  );
}

export default UploadEditPage;
