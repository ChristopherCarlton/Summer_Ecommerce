"use client";
import React, { useState } from "react";
import { supabase } from '../../lib/supabaseClient';
import EditPage from "../components/EditPage/editPage";

function UploadEditPage() {
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newCategory, setNewCategory] = useState<string | null>(null);
  const [newBestseller, setNewBestseller] = useState(false);
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

  const handleBestsellerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBestseller(e.target.checked);
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
          category: newCategory,
          is_bestseller: newBestseller
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
          setNewCategory(null);
          setNewBestseller(false);
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
    <div className="min-h-screen bg-neutral">
      <header className="bg-white shadow-md mb-8">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-display text-primary">Upload New Item</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-display text-primary mb-6">Add New Item</h2>
          <div className="space-y-6">
            <input 
              type="file" 
              id="imageInput" 
              onChange={handleImageChange} 
              className="w-full p-2 border border-neutral-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" 
            />
            <input
              type="text"
              value={newDescription}
              onChange={handleDescriptionChange}
              placeholder="Description"
              className="w-full p-3 border border-neutral-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-text"
            />
            <input
              type="text"
              value={newLink}
              onChange={handleLinkChange}
              placeholder="Link (optional)"
              className="w-full p-3 border border-neutral-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-text"
            />
            <select
              value={newCategory || "null"}
              onChange={handleCategoryChange}
              className="w-full p-3 border border-neutral-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-text"
            >
              <option value="null">Select Category</option>
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
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newBestseller"
                checked={newBestseller}
                onChange={handleBestsellerChange}
                className="w-5 h-5 text-primary border-neutral-dark rounded focus:ring-primary"
              />
              <label htmlFor="newBestseller" className="ml-2 text-text">Best Seller</label>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Upload Item
            </button>
            {message && (
              <div className={`p-4 rounded-lg text-white ${message.color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
      <EditPage />
    </div>
  );
}

export default UploadEditPage;