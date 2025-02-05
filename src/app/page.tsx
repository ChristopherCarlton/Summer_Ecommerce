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
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>("newest");

  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const { data: firstBatch, error: firstError } = await supabase
          .from('summerItems')
          .select('*')
          .range(0, 999)
          .order('id', { ascending: false });

        if (firstError) throw firstError;

        const { data: secondBatch, error: secondError } = await supabase
          .from('summerItems')
          .select('*')
          .range(1000, 1999)
          .order('id', { ascending: false });

        if (secondError) throw secondError;

        const allItems = [...(firstBatch || []), ...(secondBatch || [])].sort((a, b) => b.id - a.id);
        setItems(allItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  const getImageUrl = (id: number) => {
    return `https://summersshop.com/summer-item-${id}.png`;
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
        <div className="flex justify-end mb-8">
          <div className="flex items-center">
            <label htmlFor="sortOrder" className="text-white font-semibold mr-2">Sort:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border border-gray-300 rounded text-black min-w-[120px]"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-8">
              Loading items...
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="col-span-full text-center py-8">
              No items found.
            </div>
          ) : (
            sortedItems.map((item) => (
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
            ))
          )}
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
