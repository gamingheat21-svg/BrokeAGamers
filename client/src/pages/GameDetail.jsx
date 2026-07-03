import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShieldAlert, ShieldX, Cpu, HardDrive, Monitor, ArrowLeft, Tag } from 'lucide-react';

const GameDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [compat, setCompat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGameDetails();
  }, [id]);

  const fetchGameDetails = async () => {
    setLoading(true);
    try {
      // Fetch directly from CheapShark to bypass backend IP block
      const res = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch from CheapShark');
      const csGameDetails = await res.json();
      
      if (!csGameDetails || !csGameDetails.info) {
        throw new Error('Game not found');
      }

      // We need to fetch stores to map storeID to storeName
      const storesRes = await fetch('https://www.cheapshark.com/api/1.0/stores');
      const stores = await storesRes.json();

      const mappedDeals = (csGameDetails.deals || []).map(deal => {
        const storeInfo = stores.find(s => s.storeID === deal.storeID);
        return {
          store: storeInfo ? storeInfo.storeName : `Store ${deal.storeID}`,
          normalPrice: parseFloat(deal.retailPrice),
          salePrice: parseFloat(deal.price),
          savings: parseFloat(deal.savings)
        };
      });

      // Mock requirements since RAWG is mocked in backend anyway
      const mockRequirements = {
        minimum: { os: "Windows 10", processor: "Intel Core i5-3570K", memory: "8 GB RAM", graphics: "GTX 970" },
        recommended: { os: "Windows 10", processor: "Intel Core i7-4790", memory: "12 GB RAM", graphics: "GTX 1060" }
      };

      setGame({
        id,
        name: csGameDetails.info.title,
        requirements: mockRequirements,
        deals: mappedDeals
      });
      
      if (user) {
        try {
          const compatRes = await api.get(`/compatibility/check/${id}`);
          setCompat(compatRes.data);
        } catch (err) {
          console.error("No specs or compatibility error", err);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !game) return <div className="text-red-400 text-center py-10">{error || 'Game not found'}</div>;

  const renderBadge = () => {
    if (!compat) return null;
    
    if (compat.status.includes('Smoothly')) {
      return (
        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl flex items-start gap-4">
          <ShieldCheck className="text-green-500 shrink-0" size={32} />
          <div>
            <h3 className="text-xl font-bold text-green-500 mb-1">{compat.status}</h3>
            <p className="text-green-200/80">{compat.summary}</p>
          </div>
        </div>
      );
    }
    
    if (compat.status.includes('Minimum')) {
      return (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl flex items-start gap-4">
          <ShieldAlert className="text-yellow-500 shrink-0" size={32} />
          <div>
            <h3 className="text-xl font-bold text-yellow-500 mb-1">{compat.status}</h3>
            <p className="text-yellow-200/80">{compat.summary}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl flex items-start gap-4">
        <ShieldX className="text-red-500 shrink-0" size={32} />
        <div>
          <h3 className="text-xl font-bold text-red-500 mb-1">{compat.status}</h3>
          <p className="text-red-200/80">{compat.summary}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link to="/search" className="flex items-center gap-2 text-text_muted hover:text-white mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Search
      </Link>
      
      <h1 className="text-4xl font-bold text-white mb-8">{game.name}</h1>

      {user && (
        <div className="card p-4 mb-8 bg-gray-900 border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">Track this game</h3>
            <p className="text-sm text-gray-400">Get notified when the price drops below your target.</p>
          </div>
          <form 
            className="flex items-center gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const price = e.target.price.value;
              try {
                await api.post('/wishlist', { gameId: id, targetPrice: price, title: game.name });
                alert('Added to wishlist!');
              } catch (err) {
                alert(err.response?.data?.message || 'Failed to add');
              }
            }}
          >
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input type="number" name="price" step="0.01" className="input pl-8 w-24 py-1" placeholder="19.99" required />
            </div>
            <button type="submit" className="btn-primary py-2 text-sm">Add Alert</button>
          </form>
        </div>
      )}

      {!user ? (
        <div className="card p-6 mb-8 text-center bg-gray-900 border-dashed border-2 border-gray-700">
          <h3 className="text-xl font-bold mb-2">Can you run it?</h3>
          <p className="text-gray-400 mb-4">Log in and set up your PC specs to instantly check if this game will run on your system.</p>
          <Link to="/login" className="btn-primary inline-block">Login to Check Compatibility</Link>
        </div>
      ) : (
        <div className="mb-8">
          {renderBadge()}
        </div>
      )}

      {game.deals && game.deals.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Tag className="text-primary" /> Current Deals
          </h2>
          <div className="space-y-4">
            {game.deals.map((deal, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-800">
                <span className="font-bold text-lg">{deal.store}</span>
                <div className="flex items-center gap-4">
                  {Number(deal.salePrice) === 0 ? (
                    <span className="text-accent font-bold text-xl uppercase tracking-wider">Free!</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through">${deal.normalPrice}</span>
                      <span className="text-accent font-bold text-xl">${deal.salePrice}</span>
                      {deal.savings > 0 && (
                        <span className="bg-accent/20 text-accent px-2 py-1 rounded text-sm font-bold">-{Math.round(deal.savings)}%</span>
                      )}
                    </div>
                  )}
                  <a href="#" className="btn-primary py-1 px-4 text-sm ml-2">Get Deal</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Monitor className="text-primary" /> System Requirements
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-300 mb-4 border-b border-gray-800 pb-2">Minimum</h3>
            {game.requirements?.minimum ? (
              <ul className="space-y-3 text-sm text-gray-400">
                <li><strong className="text-gray-300">OS:</strong> {game.requirements.minimum.os}</li>
                <li><strong className="text-gray-300">Processor:</strong> {game.requirements.minimum.processor}</li>
                <li><strong className="text-gray-300">Memory:</strong> {game.requirements.minimum.memory}</li>
                <li><strong className="text-gray-300">Graphics:</strong> {game.requirements.minimum.graphics}</li>
              </ul>
            ) : (
              <p className="text-gray-500 italic">Not available</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-300 mb-4 border-b border-gray-800 pb-2">Recommended</h3>
            {game.requirements?.recommended ? (
              <ul className="space-y-3 text-sm text-gray-400">
                <li><strong className="text-gray-300">OS:</strong> {game.requirements.recommended.os}</li>
                <li><strong className="text-gray-300">Processor:</strong> {game.requirements.recommended.processor}</li>
                <li><strong className="text-gray-300">Memory:</strong> {game.requirements.recommended.memory}</li>
                <li><strong className="text-gray-300">Graphics:</strong> {game.requirements.recommended.graphics}</li>
              </ul>
            ) : (
              <p className="text-gray-500 italic">Not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
