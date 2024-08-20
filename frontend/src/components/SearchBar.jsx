import { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
        setQuery('');
    };

    return (
        <div className="relative flex items-center bg-secondary h-10 rounded-full p-2">
            <input type="text" placeholder="Search" value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-full px-4 rounded-full outline-none bg-transparent"
            />
            <button className="absolute right-2" onClick={handleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-6 w-6 mr-2" viewBox="0 0 512 512">
                    <path d="M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" />
                </svg>
            </button>
        </div>
    );
}
