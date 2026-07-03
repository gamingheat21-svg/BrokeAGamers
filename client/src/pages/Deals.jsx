import { useState, useEffect } from 'react';
import api from '../services/api';
import DealCard from '../components/DealCard';
import { Filter } from 'lucide-react';

const PAGE_SIZE = 60;

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');

  // Simple filters state
  const [filters, setFilters] = useState({
    upperPrice: 50,
    minRating: 0
  });

  useEffect(() => {
    fetchDeals(0, false);
  }, [filters]);

  const fetchDeals = async (page = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const params = {
        pageNumber: page,
        pageSize: PAGE_SIZE
      };
      if (filters.upperPrice) params.upperPrice = filters.upperPrice;
      if (filters.minRating > 0) {
        params.minRating = filters.minRating;
      }

      const res = await api.get('/deals', { params });
      setDeals(prev => append ? [...prev, ...res.data] : res.data);
      setPageNumber(page);
      setHasMore(res.data.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
      setError('Failed to load deals');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreDeals = () => {
    fetchDeals(pageNumber + 1, true);
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map(deal => (
              <DealCard key={deal.dealID} deal={deal} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={loadMoreDeals}
                disabled={loadingMore}
                className="btn-primary min-w-40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Deals;
