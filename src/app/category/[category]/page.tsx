"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

type Item = {
  id: number;
  name: string;
  link: string;
  category: string;
  is_bestseller: boolean;
};

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>("newest");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        if (params.category === "new-arrivals") {
          // For new arrivals, just get the latest 32 items across all categories
          const { data, error } = await supabase
            .from("summerItems")
            .select("id, name, link, category, is_bestseller")
            .order('id', { ascending: false })
            .limit(32);

          if (error) throw error;
          setItems(data || []);
        } else {
          // For other categories, keep existing logic
          const { data, error } = await supabase
            .from("summerItems")
            .select("id, name, link, category, is_bestseller")
            .eq(
              params.category === "best-sellers" ? "is_bestseller" : "category",
              params.category === "best-sellers" ? true : params.category
            );

          if (error) throw error;
          setItems(data || []);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [params.category]);

  const getImageUrl = (id: number) => {
    return `https://summersshop.com/summer-item-${id}.png`;
  };

  const categoryNameMapping: { [key: string]: string } = {
    "new-arrivals": "New Arrivals",
    "best-sellers": "Best Sellers",
    handbag: "Handbags",
    wallet: "Wallets",
    glasses: "Glasses",
    duffle: "Duffle Bags",
    mens: "Men's",
    shoes: "Shoes",
    clothes: "Clothes",
    jewelry: "Jewelry",
    watches: "Watches",
    totes: "Totes",
    belts: "Belts",
    lifestyle: "Lifestyle & Home"
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
      
      <main className="container mx-auto p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-white">
            {categoryNameMapping[params.category] || params.category}
          </h1>
          
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
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-xl">Loading...</div>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-white text-xl text-center">
            No items found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <a href={item.link}>
                  <div className="relative">
                    <img
                      src={getImageUrl(item.id)}
                      alt={`${item.name}`}
                      className="w-full h-64 object-cover"
                    />
                    {item.is_bestseller && params.category !== "best-sellers" && (
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
        )}
      </main>
      <Footer />
    </div>
  );
}