import { NavLink } from "react-router-dom";

const DesktopNavigation = ({ categories }) => {

  return (
    <nav className="flex-1">
      <ul className="space-y-4">
        {categories?.map((category, index) => {

          return(
            <li key={category.id}>
            <NavLink
              to={category.path}
              className={({ isActive }) =>
                `text-left text-sm tracking-wide transition-colors duratin-200 ${
                  isActive
                    ? 'text-gray-800 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
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

export default DesktopNavigation;