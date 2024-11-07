// app/category/[category]/page.tsx
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
};

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("summerItems")
        .select("id, name, link, category")
        .eq("category", params.category);

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data as Item[]);
      }
      setLoading(false);
    };

    fetchItems();
  }, [params.category]);

  const getImageUrl = (id: number) => {
    return `https://summersshop.com/summer-item-${id}.png`;
  };

  const categoryNameMapping: { [key: string]: string } = {
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

  return (
    <div className="bg-primary min-h-screen">
      <Header />
      
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          {/* {categoryNameMapping[params.category] || params.category} */}
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-xl">Loading...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-white text-xl text-center">
            No items found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <a href={item.link}>
                  <img
                    src={getImageUrl(item.id)}
                    alt={`${item.name}`}
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
        )}
      </main>
      <Footer />
    </div>
  );
}