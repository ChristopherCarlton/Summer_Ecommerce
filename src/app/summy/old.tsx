"use client";
import React, { useState } from "react";
import { items } from "../components/items";

function UploadEditPage() {
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newLink, setNewLink] = useState("");
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [editedLink, setEditedLink] = useState("");

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

  const handleSubmit = () => {
    if (newImage && newDescription && newLink) {
      const newItem = {
        id: items.length + 1,
        name: newDescription,
        link: newLink || URL.createObjectURL(newImage),
      };
      items.push(newItem);
      setNewImage(null);
      setNewDescription("");
      setNewLink("");
    }
  };

  const handleEdit = (id: number) => {
    setEditMode(id);
    const item = items.find((item) => item.id === id);
    if (item) {
      setEditedName(item.name);
      setEditedLink(item.link);
    }
  };

  const handleEditSubmit = (id: number) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      items[itemIndex].name = editedName;
      items[itemIndex].link = editedLink || (editedImage ? URL.createObjectURL(editedImage) : items[itemIndex].link);
      setEditMode(null);
      setEditedName("");
      setEditedImage(null);
      setEditedLink("");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedName("");
    setEditedImage(null);
    setEditedLink("");
  };

  return (
    <div className="bg-[#FFC0CB] min-h-screen p-8">
      <header className="bg-white text-[#FF69B4] p-6 shadow-md mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold font-pacifico">Upload and Edit Items</h1>
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
            placeholder="Link"
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

      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-[#FF69B4] mb-4">Items List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <a href={item.link}>
                <img
                  src={`/images/summer-item-${item.id}.png`}
                  alt={`Summer item: ${item.name} - perfect for beach days`}
                  className="w-full h-64 object-cover"
                />
              </a>
              <div className="p-4">
                <p className="text-[#FF69B4] font-semibold font-roboto text-xl">{item.name}</p>
                <button
                  onClick={() => handleEdit(item.id)}
                  className="mt-2 bg-[#FF69B4] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#FFC0CB] transition duration-300 w-full"
                >
                  Edit
                </button>
              </div>
              {editMode === item.id && (
                <div className="p-4">
                  <input
                    type="file"
                    onChange={(e) => setEditedImage(e.target.files ? e.target.files[0] : null)}
                    className="mb-4 w-full text-black"
                  />
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Edit Name"
                    className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    value={editedLink}
                    onChange={(e) => setEditedLink(e.target.value)}
                    placeholder="Edit Link"
                    className="mb-4 w-full p-2 border border-gray-300 rounded text-black"
                  />
                  <button
                    onClick={() => handleEditSubmit(item.id)}
                    className="bg-[#FF69B4] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FFC0CB] transition duration-300 w-full mb-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-400 transition duration-300 w-full"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UploadEditPage;
