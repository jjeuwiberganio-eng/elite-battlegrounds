"use client";

import {
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  delay?: number;
  onSearch: (value: string) => void;
}

export default function SearchInput({
  value = "",
  placeholder = "Search...",
  delay = 300,
  onSearch,
}: Readonly<SearchInputProps>) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearch(query.trim());
    }, delay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query, delay, onSearch]);

  return (
    <div className="relative w-full max-w-md">

      {/* Search Icon */}

      <Search
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          h-5
          w-5
          -translate-y-1/2
          text-slate-500
        "
      />

      {/* Input */}

      <input
        type="search"
        value={query}
        placeholder={placeholder}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-slate-700
          bg-slate-900
          pl-12
          pr-12
          text-white
          placeholder:text-slate-500
          outline-none
          transition-all
          duration-200
          focus:border-amber-500
          focus:ring-2
          focus:ring-amber-500/30
        "
      />

      {/* Clear Button */}

      {query.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setQuery("")}
          className="
            absolute
            right-3
            top-1/2
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            text-slate-400
            transition
            hover:bg-slate-800
            hover:text-white
          "
        >
          <X className="h-4 w-4" />
        </button>
      )}

    </div>
  );
}