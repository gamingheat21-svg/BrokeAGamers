import { useState, useEffect } from 'react';
import api from '../services/api';
import DealCard from '../components/DealCard';
import { Filter } from 'lucide-react';

const Recommendations = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [maxPrice, setMaxPrice] = useState(30);

  useEffect(() => {
    fetchRecommendations();
  }, [maxPrice]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/recommendations', { params: { maxPrice } });
      setDeals(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">For Your Rig</h1>
          <p className="text-text_muted">Highly rated games tailored for your PC's capabilities.</p>
        </div>

        <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
          <Filter size={20} className="text-primary" />
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 font-medium">Budget</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">$</span>
              <input 
                type="number" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
                className="bg-gray-800 text-white px-3 py-1.5 rounded-md w-20 outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-400 mb-6 bg-red-900/20 p-4 rounded-lg border border-red-500/30">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No games found matching your criteria. Try increasing your budget.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map(deal => (
            <div key={deal.dealID} className="relative group">
              <div className="absolute -top-3 -right-3 z-10 bg-gray-900 px-3 py-1 rounded-full text-xs font-bold border shadow-lg border-gray-700">
                {deal.compatStatus.includes('Smoothly') ? (
                  <span className="text-green-400">🟢 Plays Great</span>
                ) : (
                  <span className="text-yellow-400">🟡 Plays OK</span>
                )}
              </div>
              <DealCard deal={deal} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
