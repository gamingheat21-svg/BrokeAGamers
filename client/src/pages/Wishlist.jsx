import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Trash2, ExternalLink } from 'lucide-react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data);
    } catch (err) {
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (gameId) => {
    try {
      await api.delete(`/wishlist/${gameId}`);
      setWishlist(prev => prev.filter(item => item.game_id !== gameId));
    } catch (err) {
      alert('Failed to remove from wishlist');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-2">My Wishlist</h1>
      <p className="text-text_muted mb-8">Games you're watching for price drops.</p>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-400 mb-4">Your wishlist is empty.</p>
          <Link to="/search" className="btn-primary inline-block">Find Games to Watch</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="card p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-white mb-2">{item.game_title}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Target Price: <strong className="text-accent">${item.target_price || 'Any drop'}</strong>
                </p>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                <Link to={`/game/${item.game_id}`} className="text-primary hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                  <ExternalLink size={16} /> Details
                </Link>
                <button 
                  onClick={() => handleRemove(item.game_id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-2"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
