"use client";
import React, { useState } from "react";
import { supabase } from '../../lib/supabaseClient';
import EditPage from "../components/EditPage/editPage";

function UploadEditPage() {
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newCategory, setNewCategory] = useState<string | null>(null);  // Allow null for category
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCategory(e.target.value === "null" ? null : e.target.value);
  };

  const handleSubmit = async () => {
    if (newImage && newDescription) {
      const id = Date.now();

      try {
        const formData = new FormData();
        formData.append('file', newImage);
        formData.append('key', `summer-item-${id}.png`);

        const response = await fetch(`/api/cloudflare/upload-image`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image to Cloudflare R2');
        }

        const data = await response.json();
        const imageUrl = data.url;

        const newItem = {
          id: id,
          name: newDescription,
          link: newLink || imageUrl,
          category: newCategory,  // Category can be null
        };

        const { data: insertData, error } = await supabase
          .from('summerItems')
          .insert([newItem]);

        if (error) {
          setMessage({ text: 'Upload failed', color: 'red' });
        } else {
          setMessage({ text: 'Upload success', color: 'green' });
          setNewImage(null);
          setNewDescription("");
          setNewLink("");
          setNewCategory(null);  // Reset category field
          (document.getElementById("imageInput") as HTMLInputElement).value = "";
        }
      } catch (error) {
        setMessage({ text: 'Upload failed', color: 'red' });
      }
    } else {
      setMessage({ text: 'Please provide an image and description', color: 'red' });
    }
  };

  return (
    <div className="bg-primary min-h-screen p-8">
      <header className="bg-white text-secondary p-6 shadow-md mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold font-pacifico">Upload New Item</h1>
        </div>
      </header>

      <div className="container mx-auto mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Add New Item</h2>
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
          <select
            value={newCategory || "null"}
            onChange={handleCategoryChange}
            className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
          >
            <option value="null">No Category</option>
            <option value="handbag">Handbag</option>
            <option value="wallet">Wallet</option>
            <option value="makeupBag">Makeup Bag</option>
            <option value="totes">Totes</option>
            <option value="glasses">Glasses</option>
            <option value="duffle">Duffle</option>
            <option value="mens">Mens</option>
            <option value="shoes">Shoes</option>
            <option value="clothes">Clothes</option>
            <option value="jewelry">Jewelry</option>
            <option value="watches">Watches</option>
            <option value="belts">Belts</option>
            <option value="lifestyle">Lifestyle & Home</option>
          </select>
          <button
            onClick={handleSubmit}
            className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary transition duration-300 w-full"
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
