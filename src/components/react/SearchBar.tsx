import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

/**
 * SearchBar Component
 * 
 * Provides a search input with debouncing to avoid excessive filtering.
 * Features:
 * - 300ms debounce delay to reduce filter operations while typing
 * - Clear button appears when there's text
 * - Search icon for visual clarity
 */
export default function SearchBar({ onSearchChange, placeholder = 'Search notes...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  // Debounce search input to avoid filtering on every keystroke
  // Waits 300ms after user stops typing before triggering search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(query);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  }, [query, onSearchChange]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 pl-9 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-zinc-500 text-sm"
        aria-label="Search notes"
      />
      <svg
        className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

