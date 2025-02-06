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
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-display text-text mb-4">
            {categoryNameMapping[params.category] || params.category}
          </h1>
          <div className="w-24 h-1 bg-secondary mx-auto"></div>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-end mb-8">
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl text-text-light">No items found in this category.</h3>
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
                      alt={`${item.name}`}
                      className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    {item.is_bestseller && params.category !== "best-sellers" && (
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
      </main>
      <Footer />
    </div>
  );
}