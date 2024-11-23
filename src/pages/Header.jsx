import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getCurrentUser } from '../auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentUser = getCurrentUser();

  const adminLinks = [
    { to: '/admin/restaurant-admin', label: 'Restaurant Admin' },
    { to: '/admin/weekly-menu-planner', label: 'Weekly Menu Planner' },
    { to: '/admin/store-hours-manager', label: 'Store Hours Manager' },
    { to: '/admin/inquiry', label: 'Inquiry Admin' },
  ];

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <img src="src\assets\logo.jpg " alt="Logo" className="mr-4 w-70 h-20" />
        </div>
        <button
          className="md:hidden block p-2 hover:bg-gray-700 rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        <nav
          className={`md:block ${
            isMenuOpen ? 'block' : 'hidden'
          } absolute top-16 left-0 right-0 bg-gray-800 z-10 px-4 py-2 md:static md:bg-transparent md:px-0 md:py-0`}
        >
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            {!currentUser && (<><li><Link to="/home" className="hover:text-gray-400">Home</Link></li>
            <li><Link to="/aboutus" className="hover:text-gray-400">About US</Link></li>
            <li><Link to="/contact-us" className="hover:text-gray-400">Inquiry Form</Link></li>
            </>)}
            {currentUser && (
              <>
                {adminLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.to} className="hover:text-gray-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;