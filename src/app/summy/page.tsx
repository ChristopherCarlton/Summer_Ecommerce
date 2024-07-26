"use client"
import React, { useState } from "react";
import { supabase } from '../../lib/supabaseClient';

function UploadEditPage() {
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newLink, setNewLink] = useState("");

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

      // Upload image to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('product-images')
        .upload(`public/summer-item-${id}`, newImage);

      if (storageError) {
        console.error('Failed to upload image:', storageError);
        return;
      }

      // Get the public URL of the uploaded image
      const { data: { publicUrl: imageUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(`public/summer-item-${id}`);

      // Insert the new item into the database
      const newItem = {
        name: newDescription,
        link: newLink || imageUrl,
      };

      const { data, error } = await supabase
        .from('items')
        .insert([newItem]);

      if (error) {
        console.error('Failed to add item:', error);
      } else {
        console.log('Item added successfully:', data);
        setNewImage(null);
        setNewDescription("");
        setNewLink("");
      }
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
          <input type="file" onChange={handleImageChange} className="mb-4 w-full text-black" />
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
        </div>
      </div>
    </div>
  );
}

export default UploadEditPage;
