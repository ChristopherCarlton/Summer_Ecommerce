import React, { useState } from 'react';
import { FaTiktok, FaInstagram, FaBars, FaTimes } from 'react-icons/fa';
import { Pacifico } from "@next/font/google";
import Link from 'next/link';

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

const categories = [
  { name: "All Items", path: "/" },
  { name: "Handbags", path: "/category/handbag" },
  { name: "Wallets", path: "/category/wallet" },
  { name: "Glasses", path: "/category/glasses" },
  { name: "Duffle Bags", path: "/category/duffle" },
  { name: "Men's", path: "/category/mens" },
  { name: "Shoes", path: "/category/shoes" },
  { name: "Clothes", path: "/category/clothes" },
  { name: "Jewelry", path: "/category/jewelry" },
  { name: "Watches", path: "/category/watches" },
  { name: "Totes", path: "/category/totes" },
  { name: "Belts", path: "/category/belts" },
  { name: "Lifestyle & Home", path: "/category/lifestyle" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white text-primary shadow-md">
      {/* Main header content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className={`text-4xl font-bold ${pacifico.className}`}>
            Summer Shop
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Social Icons */}
            <div className="hidden md:flex space-x-6">
              <a 
                href="https://www.tiktok.com/@summerrvu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-[#ADD8E6]"
              >
                <FaTiktok size={24} />
              </a>
              <a 
                href="https://www.instagram.com/summer.vu/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-[#ADD8E6]"
              >
                <FaInstagram size={24} />
              </a>
            </div>
            
            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary hover:text-[#ADD8E6] p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`
          fixed left-0 right-0 
          bg-white shadow-lg
          transition-all duration-300 ease-in-out z-50
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          max-h-[80vh] overflow-y-auto
        `}
      >
        <nav className="container mx-auto px-4 py-4">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.path}>
                <Link 
                  href={category.path}
                  className="block py-2 px-4 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            {/* Mobile Social Links */}
            <li className="md:hidden flex space-x-4 py-2 px-4">
              <a 
                href="https://www.tiktok.com/@summerrvu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-[#ADD8E6]"
              >
                <FaTiktok size={24} />
              </a>
              <a 
                href="https://www.instagram.com/summer.vu/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-[#ADD8E6]"
              >
                <FaInstagram size={24} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}