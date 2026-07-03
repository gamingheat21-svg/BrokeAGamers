import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      // Bypass backend to fetch directly from CheapShark
      const res = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(searchQuery)}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      const mappedResults = data.map(game => ({
        id: game.gameID,
        name: game.external,
        released: `Cheapest: $${game.cheapest}`,
        background_image: game.thumb
      }));
      
      setResults(mappedResults);
    } catch (err) {
      console.error(err);
      setError('Failed to search games');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">
          {initialQuery ? `Search Results for "${initialQuery}"` : "Search Games"}
        </h1>
        <p className="text-text_muted">Find out if your PC can run it before you buy.</p>
      </div>

      {error && <div className="text-red-400 text-center">{error}</div>}
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(game => (
            <Link to={`/game/${game.id}`} key={game.id} className="card hover:-translate-y-1 transition-transform group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={game.background_image || 'https://via.placeholder.com/600x400?text=No+Image'} 
                  alt={game.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              </div>
              <div className="p-4 -mt-8 relative z-10">
                <h3 className="font-bold text-xl text-white mb-1">{game.name}</h3>
                <p className="text-sm text-gray-400">Released: {game.released || 'TBA'}</p>
                <div className="mt-4 text-primary font-medium text-sm flex items-center gap-1 group-hover:text-white transition-colors">
                  Check Compatibility & Deals →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
