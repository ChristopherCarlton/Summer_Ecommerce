"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Item = {
  id: number;
  name: string;
  link: string;
  category: string | null;
  is_bestseller: boolean;
};

function EditPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const [editedCategory, setEditedCategory] = useState<string | null>(null);
  const [editedBestseller, setEditedBestseller] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; color: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        // Fetch first batch (0-999)
        const { data: firstBatch, error: firstError } = await supabase
          .from('summerItems')
          .select('id, name, link, category, is_bestseller')
          .range(0, 999)
          .order('id', { ascending: false });

        if (firstError) throw firstError;

        // Fetch second batch (1000-1999)
        const { data: secondBatch, error: secondError } = await supabase
          .from('summerItems')
          .select('id, name, link, category, is_bestseller')
          .range(1000, 1999)
          .order('id', { ascending: false });

        if (secondError) throw secondError;

        // Combine and sort all items
        const allItems = [...(firstBatch || []), ...(secondBatch || [])].sort((a, b) => b.id - a.id);
        
        setItems(allItems);
        console.log(`Total items loaded: ${allItems.length}`);
      } catch (error) {
        console.error('Error fetching items:', error);
        setMessage({ text: 'Error loading items', color: 'red' });
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  const handleEdit = (item: Item) => {
    setEditMode(item.id);
    setEditedName(item.name);
    setEditedLink(item.link);
    setEditedCategory(item.category);
    setEditedBestseller(item.is_bestseller || false);
    setEditedImage(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedName("");
    setEditedLink("");
    setEditedCategory(null);
    setEditedBestseller(false);
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
      .update({ 
        name: editedName, 
        link: imageUrl, 
        category: editedCategory,
        is_bestseller: editedBestseller 
      })
      .eq('id', id);

    if (error) {
      setMessage({ text: 'Failed to update item', color: 'red' });
    } else {
      setItems(items.map((item) => (
        item.id === id 
          ? { 
              ...item, 
              name: editedName, 
              link: imageUrl, 
              category: editedCategory,
              is_bestseller: editedBestseller 
            } 
          : item
      )));
      setMessage({ text: 'Item updated successfully', color: 'green' });
      handleCancelEdit();
    }
  };

  const handleDelete = async (id: number) => {
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
    <div className="min-h-screen bg-neutral">
      <header className="bg-white shadow-md mb-8">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-display text-primary">Edit Items</h1>
          <span className="text-text-light">
            {loading ? 'Loading...' : `${items.length} items`}
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {editMode === item.id ? (
                  <div className="p-6 space-y-4">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full p-3 border border-neutral-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-text"
                      placeholder="Item Name"
                    />
                    <input
                      type="text"
                      value={editedLink}
                      onChange={(e) => setEditedLink(e.target.value)}
                      className="w-full p-3 border border-neutral-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-text"
                      placeholder="Edit Link"
                    />
                    <select
                      value={editedCategory || "null"}
                      onChange={(e) => setEditedCategory(e.target.value === "null" ? null : e.target.value)}
                      className="w-full p-3 border border-neutral-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-text"
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
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="bestseller"
                        checked={editedBestseller}
                        onChange={(e) => setEditedBestseller(e.target.checked)}
                        className="w-5 h-5 text-primary border-neutral-dark rounded focus:ring-primary"
                      />
                      <label htmlFor="bestseller" className="ml-2 text-text">Best Seller</label>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setEditedImage(e.target.files ? e.target.files[0] : null)}
                      className="w-full p-3 border border-neutral-dark rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSubmit(item.id)}
                        className="flex-1 bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-neutral-dark hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="relative">
                      <img
                        src={getImageUrl(item.id)}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      {item.is_bestseller && (
                        <span className="absolute top-2 right-2 bg-secondary text-white text-xs px-3 py-1 rounded-full font-semibold">
                          Best Seller
                        </span>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-text">{item.name}</h3>
                        <p className="text-text-light mt-1">{item.category || "No Category"}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex-1 bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="flex-1 bg-secondary hover:bg-secondary-light text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold text-text mb-4">Confirm Delete</h3>
            <p className="text-text-light mb-6">Are you sure you want to delete this item?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-neutral-dark hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-secondary hover:bg-secondary-light text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPage;