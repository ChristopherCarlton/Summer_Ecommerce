"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Header from "./header";
import Footer from "./footer";

// Define the type for the items
type Item = {
  id: number;
  name: string;
  link: string;
};

function MainComponent() {
  const [items, setItems] = useState<Item[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      console.log("Fetching items from Supabase...");
      const response = await supabase
        .from("summerItems")
        .select("*");

      console.log("Supabase response:", response);

      if (response.error) {
        console.error("Error fetching items:", response.error);
      } else {
        console.log("Fetched items:", response.data);
        setItems(response.data as Item[]);
      }
    };

    fetchItems();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getImageUrl = (id: number) => {
    const url = `https://psxmuvbtzgqsynfweilj.supabase.co/storage/v1/object/public/product-images/summer-item-${id}.png`;
    console.log(`Image URL for item ${id}:`, url);
    return url;
  };

  return (
    <div className="bg-[#FFC0CB] min-h-screen">
      <Header />
      
      <section className="relative">
        <img
          src="/images/ANG2.png"
          alt="Summer Giveaway featuring beach accessories and tropical scenery"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* <div className="text-center">
            <h2 className="text-white text-4xl font-bold mb-4">
              Summer Giveaway!
            </h2>
            <button
              onClick={toggleDropdown}
              className="bg-white text-[#FF69B4] px-6 py-3 rounded-full font-semibold hover:bg-[#FFC0CB] transition duration-300"
            >
              Click here for details
            </button>
            {isDropdownOpen && (
              <div className="mt-4 bg-white text-[#FF69B4] p-4 rounded-lg">
                <p>To enter the giveaway:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Follow us on Instagram</li>
                  <li>Comment on our latest post</li>
                  <li>Tag 3 friends</li>
                </ul>
              </div>
            )}
          </div> */}
        </div>
      </section>

      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.length === 0 && <p>No items found.</p>}
          {items.map((item) => (
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
                <p className="text-[#FF69B4] font-semibold font-roboto text-xl">
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

export default MainComponent;
