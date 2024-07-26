
export default function Header(){
    return(
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
    )
}