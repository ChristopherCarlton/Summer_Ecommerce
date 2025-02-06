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
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <section className="relative bg-primary-dark">
        <img
          src="/images/ANG2.webp"
          alt="Summer Giveaway featuring beach accessories and tropical scenery"
          className="w-full h-[500px] object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-8 sm:px-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-white mb-4">
            Luxury Collection
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-xl mb-8">
            Discover our curated selection of premium fashion and accessories
          </p>
          <a 
            href="#products" 
            className="bg-secondary hover:bg-secondary-light text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
          >
            Shop Now
          </a>
        </div>
      </section>

      <main id="products" className="container mx-auto px-4 py-16">
        <div className="flex flex-col space-y-12">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-display text-text">Latest Arrivals</h2>
            <div className="relative">
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none bg-white border border-neutral-dark rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary text-text"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              sortedItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <a href={item.link}>
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageUrl(item.id)}
                        alt={`Summer item: ${item.name} - perfect for beach days`}
                        className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                      {item.is_bestseller && (
                        <span className="absolute top-2 right-2 bg-secondary text-white text-xs px-3 py-1 rounded-full font-semibold">
                          Best Seller
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-text font-semibold text-lg group-hover:text-secondary transition-colors duration-300">
                        {item.name}
                      </p>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
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
