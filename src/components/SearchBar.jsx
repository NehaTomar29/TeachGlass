import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ placeholder = "Search your school (e.g., DPS RK Puram)...", onAddSchoolClick }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/directory?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3.5 pl-4 pr-28 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </form>
      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={onAddSchoolClick}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
        >
          Can't find your school? Add your school
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
