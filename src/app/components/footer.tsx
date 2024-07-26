export default function Footer(){
    return(
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
    )
}