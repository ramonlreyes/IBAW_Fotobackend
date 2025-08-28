import { useState } from "react";
import { NavLink } from "react-router-dom";

const MobileNavigation = ({ categories, onClose }) => {
  return (
    <nav className="mb-6">
      <ul className="space-y-4 text-center">
        {categories.map((category) => {
          if (category.isDivider) {
            return (
              <li key={category.id} className="border-t border-gray-200 pt-4 mt-6">
              </li>
            );
          }

          return(
            <li key={category.id}>
              <NavLink
                to={category.path}
                className={({ isActive }) =>
                  `block text-sm tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-gray-800 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
                onClick={onClose}
              >
              {category.displayName}
            </NavLink>
          </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNavigation;