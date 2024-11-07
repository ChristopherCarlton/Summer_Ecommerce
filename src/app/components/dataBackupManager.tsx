"use client";
import React, { useEffect, useState } from "react";
import Header from "./header";
import Footer from "./footer";

// Define the type for the items
type Item = {
  id: number;
  name: string;
  link: string;
};

function DataBackupManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      console.log("Fetching items from local JSON...");
      try {
        const response = await fetch("/data/items.json");
        const data = await response.json();
        console.log("Fetched items:", data);
        setItems(data as Item[]);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getImageUrl = (id: number) => {
    const url = `/images/summer-item-${id}.png`;
    console.log(`Image URL for item ${id}:`, url);
    return url;
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  });

  return (
    <div className="bg-primary min-h-screen">
      <Header />
      
      <section className="relative">
        <img
          src="/images/ANG2.webp"
          alt="Summer Giveaway featuring beach accessories and tropical scenery"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
        </div>
      </section>

      <main className="container mx-auto p-8">
        <div className="mb-4">
          <label htmlFor="sortOrder" className="text-primary font-semibold">Sort:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded text-black"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedItems.length === 0 && <p>No items found.</p>}
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <a href={item.link}>
                <img
                  src={getImageUrl(item.id)}
                  alt={`Summer item: ${item.name} - perfect for beach days`}
                  className="w-full h-64 object-cover"
                />
              </a>
              <div className="p-4">
                <p className="text-primary font-semibold font-roboto text-xl">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DataBackupManager;
