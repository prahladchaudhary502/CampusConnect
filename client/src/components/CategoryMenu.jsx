// CategoryMenu.jsx
import React, { useState } from 'react';

const CategoryMenu = ({ categories, menu, setMenu }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="flex flex-wrap justify-center gap-2 my-8">
      {categories.slice(0, showAll ? categories.length : 6).map((item) => {
        const lowerItem = item.toLowerCase(); // normalize
        return (
          <span
            key={lowerItem}
            onClick={() => setMenu(lowerItem)}
            className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition
              ${menu === lowerItem ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-white'}`}
          >
            {item}
          </span>
        );
      })}

      {categories.length > 6 && (
        <span
          onClick={() => setShowAll(!showAll)}
          className="cursor-pointer px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          {showAll ? 'See Less' : 'See More'}
        </span>
      )}
    </div>
  );
};

export default CategoryMenu;
