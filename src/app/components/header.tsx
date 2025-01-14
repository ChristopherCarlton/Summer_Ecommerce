"use client";
import React, { useState, useEffect } from 'react';
import { FaTiktok, FaInstagram, FaBars, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Pacifico } from "@next/font/google";
import Link from 'next/link';

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

const categories = [
  { name: "All Items", path: "/" },
  { name: "New Arrivals", path: "/category/new-arrivals" },
  { name: "Best Sellers", path: "/category/best-sellers" },
  { name: "Brands", path: "/brands", isBrandsMenu: true },
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

const brands = [
  { name: "CHANEL", keyword: "Chanel" },
  { name: "PRADA", keyword: "Prada" },
  { name: "GUCCI", keyword: "Gucci" },
  { name: "LOUIS VUITTON", keyword: "LV" },
  { name: "MIU MIU", keyword: "Miu" },
  { name: "BOTTEGA", keyword: "Bottega" },
  { name: "DIOR", keyword: "Dior" },
  { name: "FENDI", keyword: "Fendi" },
  { name: "HERMES", keyword: "Hermes" },
  { name: "RALPH LAUREN", keyword: "Ralph" },
  { name: "CELINE", keyword: "Celine" },
  { name: "JACQUEMUS", keyword: "Jacquemus" },
  { name: "CHROMEHEARTS", keyword: "Chrome" },
  { name: "VIVIENNE WESTWOOD", keyword: "Vivienne" },
  { name: "TORY BURCH", keyword: "Tory" },
  { name: "BALENCIAGA", keyword: "Balenciaga" },
  { name: "GOYARD", keyword: "Goyard" }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBrands, setShowBrands] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`
        sticky top-0 z-50
        bg-white text-secondary
        transition-all duration-300
        ${isScrolled ? 'py-2 shadow-md' : 'py-4'}
      `}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className={`text-4xl font-bold ${pacifico.className} transition-all duration-300 ${isScrolled ? 'scale-90' : ''}`}>
              Summer Shop
            </Link>
            
            <div className="flex items-center space-x-6">
              {/* Social Icons */}
              <div className="hidden md:flex space-x-6">
                <a 
                  href="https://www.tiktok.com/@summerrvu" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-secondary hover:text-primary transition-colors duration-200"
                >
                  <FaTiktok size={24} />
                </a>
                <a 
                  href="https://www.instagram.com/summer.vu/?hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-secondary hover:text-primary transition-colors duration-200"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
              
              {/* Hamburger Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-secondary hover:text-primary p-2 transition-colors duration-200"
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
            absolute top-full left-0 right-0
            bg-white shadow-lg
            transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
          `}
        >
          <nav className="container mx-auto px-4 py-4">
            {showBrands ? (
              <div>
                <button 
                  onClick={() => setShowBrands(false)}
                  className="flex items-center text-secondary mb-4"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
                <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {brands.map((brand) => (
                    <li key={brand.name}>
                      <Link 
                        href={`/brands/${brand.keyword.toLowerCase()}`}
                        className="block py-2 px-4 text-secondary hover:bg-primary hover:text-white rounded-lg transition-colors duration-200"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setShowBrands(false);
                        }}
                      >
                        {brand.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                {categories.map((category) => (
                  <li key={category.path}>
                    {category.isBrandsMenu ? (
                      <button 
                        className="w-full text-left py-2 px-4 text-secondary hover:bg-primary hover:text-white rounded-lg transition-colors duration-200 flex justify-between items-center"
                        onClick={() => setShowBrands(true)}
                      >
                        <span>{category.name}</span>
                        <FaArrowRight className="ml-2" />
                      </button>
                    ) : (
                      <Link 
                        href={category.path}
                        className={`block py-2 px-4 text-secondary hover:bg-primary hover:text-white rounded-lg transition-colors duration-200 ${
                          category.name === "Best Sellers" ? "font-semibold text-primary hover:text-white" : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    )}
                  </li>
                ))}
                {/* Mobile Social Links */}
                <li className="md:hidden flex space-x-4 py-2 px-4">
                  <a 
                    href="https://www.tiktok.com/@summerrvu" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    <FaTiktok size={24} />
                  </a>
                  <a 
                    href="https://www.instagram.com/summer.vu/?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-secondary hover:text-primary transition-colors duration-200"
                  >
                    <FaInstagram size={24} />
                  </a>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </header>
      
      {/* Overlay for menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setShowBrands(false);
          }}
        />
      )}
    </>
  );
}