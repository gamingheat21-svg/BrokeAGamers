import { useState, useEffect } from 'react';
import api from '../services/api';
import DealCard from '../components/DealCard';
import { Gift } from 'lucide-react';

const FreeGames = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFreeGames();
  }, []);

  const fetchFreeGames = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/deals', { params: { upperPrice: 0, onSale: 1 } });
      setDeals(res.data.filter(deal => Number(deal.salePrice) === 0));
    } catch (err) {
      console.error(err);
      setError('Failed to load free games');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Gift className="text-accent" size={40} /> Free Games Tracker
        </h1>
        <p className="text-text_muted">100% off right now. Claim them before they're gone!</p>
      </div>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No free games found at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map(deal => (
            <div key={deal.dealID} className="relative group">
              <div className="absolute -top-3 -right-3 z-10 bg-accent px-3 py-1 rounded-full text-xs font-bold border shadow-lg border-green-800 text-white animate-pulse">
                FREE
              </div>
              <DealCard deal={deal} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreeGames;
