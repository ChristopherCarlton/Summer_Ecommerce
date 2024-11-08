"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Item = {
  id: number;
  name: string;
  link: string;
  category: string | null;
};

function EditPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const [editedCategory, setEditedCategory] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; color: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from('summerItems').select('id, name, link, category');
      if (error) {
        console.error('Error fetching items:', error);
      } else {
        const sortedData = (data as Item[]).sort((a, b) => b.id - a.id);
        setItems(sortedData);
      }
    };
    fetchItems();
  }, []);

  const handleEdit = (item: Item) => {
    setEditMode(item.id);
    setEditedName(item.name);
    setEditedLink(item.link);
    setEditedCategory(item.category);
    setEditedImage(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedName("");
    setEditedLink("");
    setEditedCategory(null);
    setEditedImage(null);
  };

  const handleEditSubmit = async (id: number) => {
    let imageUrl = editedLink;

    if (editedImage) {
      try {
        const formData = new FormData();
        formData.append('file', editedImage);
        formData.append('key', `summer-item-${id}.png`);

        const response = await fetch(`/api/cloudflare/upload-image`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image to Cloudflare R2');
        }

        const data = await response.json();
        imageUrl = data.url;
      } catch (error) {
        setMessage({ text: 'Failed to upload image', color: 'red' });
        return;
      }
    }

    const { data, error } = await supabase
      .from('summerItems')
      .update({ name: editedName, link: imageUrl, category: editedCategory })
      .eq('id', id);

    if (error) {
      setMessage({ text: 'Failed to update item', color: 'red' });
    } else {
      setItems(items.map((item) => (item.id === id ? { ...item, name: editedName, link: imageUrl, category: editedCategory } : item)));
      setMessage({ text: 'Item updated successfully', color: 'green' });
      handleCancelEdit();
    }
  };

  const handleDelete = async (id: number) => {
    // First, delete the image from Cloudflare R2
    try {
      const response = await fetch(`/api/cloudflare/delete-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: `summer-item-${id}.png` }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image from Cloudflare R2');
      }
    } catch (error) {
      setMessage({ text: 'Failed to delete image from Cloudflare', color: 'red' });
      return;
    }

    // Then, delete the item from Supabase
    const { error } = await supabase
      .from('summerItems')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage({ text: 'Failed to delete item from database', color: 'red' });
    } else {
      setItems(items.filter((item) => item.id !== id));
      setMessage({ text: 'Item deleted successfully', color: 'green' });
    }

    setDeleteId(null);
  };

  const getImageUrl = (id: number) => {
    return `https://summersshop.com/summer-item-${id}.png`;
  };

  return (
    <div className="bg-primary min-h-screen p-8">
      <header className="bg-white text-secondary p-6 shadow-md mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold font-pacifico">Edit Items</h1>
        </div>
      </header>

      <div className="container mx-auto mb-8">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 relative">
            {editMode === item.id ? (
              <div className="p-4">
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
                <select
                  value={editedCategory || "null"}
                  onChange={(e) => setEditedCategory(e.target.value === "null" ? null : e.target.value)}
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
                <input
                  type="file"
                  onChange={(e) => setEditedImage(e.target.files ? e.target.files[0] : null)}
                  className="mb-4 w-full text-black"
                />
                <button
                  onClick={() => handleEditSubmit(item.id)}
                  className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary transition duration-300 w-full mb-2"
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
            ) : (
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-secondary font-semibold font-roboto text-xl">{item.name}</p>
                  <p className="text-gray-500">{item.category || "No Category"}</p>
                  <img
                    src={getImageUrl(item.id)}
                    alt={`Summer item: ${item.name}`}
                    className="w-full h-64 object-cover mb-4"
                  />
                  <a href={item.link}>
                    <button className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary transition duration-300 w-full mb-2">
                      View Item
                    </button>
                  </a>
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary transition duration-300 mb-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {message && (
          <div className={`mt-4 p-4 rounded-lg text-white`} style={{ backgroundColor: message.color }}>
            {message.text}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPage;