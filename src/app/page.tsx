"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Header from "./components/header";
import Footer from "./components/footer";

type Item = {
  id: number;
  name: string;
  link: string;
  category: string;
  is_bestseller: boolean;
};

function Home() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      console.log("Fetching items from Supabase...");
      const { data, error } = await supabase
        .from("summerItems")
        .select("*")
        .order('id', { ascending: false })
        .limit(32);

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data as Item[]);
      }
    };

    fetchItems();
  }, []);

  const getImageUrl = (id: number) => {
    return `https://summersshop.com/summer-item-${id}.png`;
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.length === 0 && <p>No items found.</p>}
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <a href={item.link}>
                <div className="relative">
                  <img
                    src={getImageUrl(item.id)}
                    alt={`Summer item: ${item.name} - perfect for beach days`}
                    className="w-full h-64 object-cover"
                  />
                  {item.is_bestseller && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                      Best Seller
                    </span>
                  )}
                </div>
              </a>
              <div className="p-4">
                <p className="text-secondary font-semibold font-roboto text-xl">
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

export default Home;


// import DataBackupManager from "./components/dataBackupManager";


// export default function Home() {
//   return (
//     // <Main/>
//     <DataBackupManager/>
//   );
// }
