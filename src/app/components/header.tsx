import { FaTiktok, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { Pacifico } from "@next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export default function Header() {
  return (
    <header className="bg-white text-[#FF69B4] p-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className={`text-4xl font-bold ${pacifico.className}`}>Summer Shop</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="https://www.tiktok.com/@summerrvu" target="_blank" rel="noopener noreferrer" className="text-[#FF69B4] hover:text-[#ADD8E6] text-lg font-semibold">
                <FaTiktok size={24} />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/summer.vu/?hl=en" target="_blank" rel="noopener noreferrer" className="text-[#FF69B4] hover:text-[#ADD8E6] text-lg font-semibold">
                <FaInstagram size={24} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
