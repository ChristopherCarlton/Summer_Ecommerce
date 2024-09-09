"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// Type for the items
type Item = {
  id: number;
  name: string;
  link: string;  // This will store the Cloudflare R2 URL
};

function EditPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const [message, setMessage] = useState<{ text: string; color: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from('summerItems').select('*');
      if (error) {
        console.error('Error fetching items:', error);
      } else {
        setItems(data as Item[]);
      }
    };
    fetchItems();
  }, []);

  const handleEdit = (item: Item) => {
    setEditMode(item.id);
    setEditedName(item.name);
    setEditedLink(item.link);
    setEditedImage(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedName("");
    setEditedLink("");
    setEditedImage(null);
  };

  const handleDelete = async (id: number) => {
    console.log(`Attempting to delete item with id ${id} from database...`);
    const { error: deleteError } = await supabase
      .from('summerItems')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Failed to delete item:', deleteError);
      setMessage({ text: 'Failed to delete item', color: 'red' });
    } else {
      console.log(`Attempting to delete image summer-item-${id}.png from Cloudflare R2...`);
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

        console.log('Image deleted successfully.');
        setItems(items.filter((item) => item.id !== id));
        setMessage({ text: 'Item deleted successfully', color: 'green' });
      } catch (error) {
        console.error('Failed to delete image:', error);
        setMessage({ text: 'Failed to delete image', color: 'red' });
      }
    }
    setDeleteId(null);
  };

  const handleEditSubmit = async (id: number) => {
    let imageUrl = editedLink;

    if (editedImage) {
      console.log('Attempting to upload new image to Cloudflare R2...');
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

        console.log('New image uploaded successfully:', imageUrl);
      } catch (error) {
        console.error('Failed to upload image:', error);
        setMessage({ text: 'Failed to upload image', color: 'red' });
        return;
      }
    }

    console.log('Updating item in the database...');
    const { data, error } = await supabase
      .from('summerItems')
      .update({ name: editedName, link: imageUrl })
      .eq('id', id);

    if (error) {
      console.error('Failed to update item:', error);
      setMessage({ text: 'Failed to update item', color: 'red' });
    } else {
      console.log('Item updated successfully:', data);
      setItems(items.map((item) => (item.id === id ? { ...item, name: editedName, link: imageUrl } : item)));
      setMessage({ text: 'Item updated successfully', color: 'green' });
      handleCancelEdit();
    }
  };

  const getImageUrl = (id: number) => {
    const url = `https://summersshop.com/summer-item-${id}.png`;
    console.log(`Image URL for item ${id}:`, url);
    return url;
  };

  return (
    <div className="bg-[#FFC0CB] min-h-screen p-8">
      <header className="bg-white text-[#FF69B4] p-6 shadow-md mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold font-pacifico">Edit Items</h1>
        </div>
      </header>

      <div className="container mx-auto mb-8">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 relative">
            <button
              onClick={() => setDeleteId(item.id)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              X
            </button>
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
                <input
                  type="file"
                  onChange={(e) => setEditedImage(e.target.files ? e.target.files[0] : null)}
                  className="mb-4 w-full text-black"
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
            ) : (
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-[#FF69B4] font-semibold font-roboto text-xl">{item.name}</p>
                  <a href={item.link}>
                    <img
                      src={getImageUrl(item.id)}
                      alt={`Summer item: ${item.name} - perfect for beach days`}
                      className="w-full h-64 object-cover"
                    />
                  </a>
                </div>
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-[#FF69B4] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FFC0CB] transition duration-300"
                >
                  Edit
                </button>
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

      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-black">Are you sure you want to delete this item?</p>
            <button
              onClick={() => handleDelete(deleteId)}
              className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold mr-2"
            >
              Yes
            </button>
            <button
              onClick={() => setDeleteId(null)}
              className="bg-gray-300 text-black px-4 py-2 rounded-full font-semibold"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPage;
