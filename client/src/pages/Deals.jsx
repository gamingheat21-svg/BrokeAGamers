import { useState, useEffect } from 'react';
import api from '../services/api';
import DealCard from '../components/DealCard';
import { Filter } from 'lucide-react';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simple filters state
  const [filters, setFilters] = useState({
    upperPrice: 50,
    minRating: 0
  });

  useEffect(() => {
    fetchDeals();
  }, [filters]);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/deals', { params: filters });
      setDeals(res.data);
    } catch (err) {
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Deals</h1>
          <p className="text-text_muted">The best current game deals across multiple stores.</p>
        </div>

        <div className="flex items-center gap-4 bg-gray-900 p-3 rounded-lg border border-gray-800">
          <Filter size={20} className="text-primary" />
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Max Price ($)</label>
              <input 
                type="number" 
                name="upperPrice" 
                value={filters.upperPrice} 
                onChange={handleFilterChange} 
                className="bg-gray-800 text-white px-2 py-1 rounded w-16 outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Min Rating</label>
              <select 
                name="minRating" 
                value={filters.minRating} 
                onChange={handleFilterChange}
                className="bg-gray-800 text-white px-2 py-1 rounded outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="0">Any</option>
                <option value="50">50+</option>
                <option value="70">70+</option>
                <option value="80">80+</option>
                <option value="90">90+</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map(deal => (
            <DealCard key={deal.dealID} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Deals;
