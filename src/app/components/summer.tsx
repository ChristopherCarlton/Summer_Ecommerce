"use client";
import React from "react";
import { items } from "./items";

function MainComponent() {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-[#FFC0CB] min-h-screen">
      <header className="bg-white text-[#FF69B4] p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold font-pacifico">
            Summer Vibes Store
          </h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="hover:text-[#FFC0CB] text-lg font-semibold"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#FFC0CB] text-lg font-semibold"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#FFC0CB] text-lg font-semibold"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#FFC0CB] text-lg font-semibold"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="relative">
        <img
          src="/images/mitten.png"
          alt="Summer Giveaway featuring beach accessories and tropical scenery"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-[#FF69B4] bg-opacity-20 flex items-center justify-center">
          <div className="text-center">
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
          </div>
        </div>
      </section>

      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <a href={`${item.link}`}>
                <img
                  src={`/images/summer-item-${item.id}.png`}
                  alt={`Summer item: ${item.name} - perfect for beach days`}
                  className="w-full h-64 object-cover"
                />
              </a>
              <div className="p-4">
                <p className="text-[#FF69B4] font-semibold font-roboto text-xl">
                  {item.name}
                </p>
                {/* <p className="text-gray-600 mt-2 font-lato">
                  {item.description}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white text-[#FF69B4] p-8 shadow-inner">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="font-lato mb-4 md:mb-0 text-lg">
            &copy; 2023 Summer Vibes Store. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-3xl hover:text-[#FFC0CB]">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-3xl hover:text-[#FFC0CB]">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-3xl hover:text-[#FFC0CB]">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-3xl hover:text-[#FFC0CB]">
              <i className="fab fa-pinterest"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;
